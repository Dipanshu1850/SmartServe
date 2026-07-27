import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { COPILOT_SYSTEM_PROMPT } from "../prompts/copilot.prompt";
import { MENU, ORDERS, TABLES } from "@/lib/mock-data";

const Input = z.object({
  question: z.string().min(1).max(500),
  role: z.enum(["customer", "staff", "manager", "owner"]).optional(),
});

const ROLE_PROMPTS: Record<string, string> = {
  customer: "You are the Guest Sommelier & Food Assistant. Focus on menu suggestions, ingredients, dietary details, wine pairings, and reservation booking help. Be warm, welcoming, and hospitable.",
  staff: "You are the Staff Operations Assistant. Help coordinate active tickets, check server checklists, monitor customer requests, and table turnaround efficiency. Be extremely brief, operational, and speed-oriented.",
  manager: "You are the Operations Copilot. Focus on smart alerts, inventory stock levels, labor costs, peak hour wait times, and kitchen queue velocity. Be analytical, data-driven, and recommendation-focused.",
  owner: "You are the Strategic Executive Advisor. Help analyze monthly revenue, profitability margins, multi-branch comparisons, labor percentages, and marketing campaign outcomes. Be professional, financial-savvy, and growth-oriented.",
};

export const askCopilot = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => Input.parse(v))
  .handler(async ({ data }) => {
    const key = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) {
      return { text: "AI Copilot is not configured. Please add GEMINI_API_KEY or VITE_GEMINI_API_KEY in your environment configuration (.env.local)." };
    }

    const rolePrompt = data.role ? ROLE_PROMPTS[data.role] : "";
    const menuContext = MENU.map(
      (item) =>
        `- ${item.name} (${item.category}, INR ${item.price}) — ${item.description}. ${
          item.available > 0 ? `Available (${item.available} remaining)` : "Unavailable / 86'd"
        }`
    ).join("\n");
    const orderContext = ORDERS.map(
      (order) =>
        `- ${order.id}: table ${order.table}; ${order.status}; ${order.minutes} minutes ago; ${order.items
          .map((item) => `${item.qty}× ${item.name}`)
          .join(", ")}; total INR ${order.total}`
    ).join("\n");
    const tableContext = TABLES.map((table) => `- ${table.id}: ${table.status}; ${table.seats} seats`).join("\n");
    const operationsContext = `\n\nCurrent order and table system data:\nOrders:\n${orderContext}\n\nTables:\n${tableContext}`;
    const customerPrompt = `You are the Guest Food Assistant for this restaurant. Be warm and concise.

The following is the complete, authoritative menu for tonight:
${menuContext}

Rules:
- Recommend only exact item names that appear in this menu and are available.
- Never invent wines, cocktails, dishes, ingredients, prices, or a bill action. If asked for wine, explain that no wine is listed and offer a listed drink only when it genuinely suits the dish.
- Clearly say an item is unavailable when it has 0 remaining.
- For dietary requests, use the menu tags and descriptions only.
- You have access to the order and table data below. Answer directly when the guest provides an order number or table. If "my order" cannot be identified from the question, ask for its order number or table number; never say that you lack access to the tracking system.${operationsContext}`;
    const completeSystemPrompt = data.role === "customer" ? customerPrompt : `${COPILOT_SYSTEM_PROMPT}\n\n[USER ROLE CONTEXT]\n${rolePrompt}${operationsContext}`;

    const promptText = `System Instructions:\n${completeSystemPrompt}\n\nUser Question:\n${data.question}`;

    try {
      const chosenModelName = "models/gemini-3.6-flash";
      const methodName = "generateContent";

      const url = `https://generativelanguage.googleapis.com/v1/${chosenModelName}:${methodName}?key=${key}`;
      const body: any = { contents: [{ parts: [{ text: promptText }] }] };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        // Fallback: list models using stable v1 endpoint, pick first GA gemini flash that supports generateContent
        const listUrl = `https://generativelanguage.googleapis.com/v1/models?pageSize=1000&key=${key}`;
        const listResp = await fetch(listUrl, { method: "GET" });
        if (!listResp.ok) throw new Error(`Could not list models: HTTP ${listResp.status}`);
        const listData = await listResp.json().catch(() => ({}));
        
        function supportsMethod(model: any, method: string) {
          return (
            typeof model?.name === "string" &&
            Array.isArray(model.supportedGenerationMethods) &&
            model.supportedGenerationMethods.includes(method)
          );
        }

        const models = Array.isArray(listData.models) ? listData.models : [];
        const fallbackModel = models.find((m: any) => supportsMethod(m, "generateContent") && m.name === "models/gemini-3.5-flash") ||
          models.find((m: any) => supportsMethod(m, "generateContent") && m.name === "models/gemini-3.5-flash-lite") ||
          models.find((m: any) => supportsMethod(m, "generateContent") && m.name === "models/gemini-3.1-flash-lite") ||
          models.find((m: any) => supportsMethod(m, "generateContent") && m.name.startsWith("models/gemini-3.")) ||
          models.find((m: any) => supportsMethod(m, "generateContent") && m.name.startsWith("models/gemini-"));
        
        if (!fallbackModel) throw new Error(`HTTP ${response.status} and no fallback model found.`);
        
        const fallbackUrl = `https://generativelanguage.googleapis.com/v1/${fallbackModel.name}:generateContent?key=${key}`;
        const fallbackResponse = await fetch(fallbackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        
        if (!fallbackResponse.ok) throw new Error(`HTTP ${fallbackResponse.status}`);
        const resData = await fallbackResponse.json();
        const reply = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
        return { text: reply?.trim() ?? "Empty response" };
      }

      const resData = await response.json();

      const reply =
        resData?.candidates?.[0]?.content?.parts?.[0]?.text ??
        resData?.candidates?.[0]?.output?.[0]?.content?.[0]?.text ??
        resData?.output?.[0]?.content?.[0]?.text ??
        resData?.message?.content?.[0]?.text ??
        resData?.text ??
        undefined;

      if (!reply) {
        throw new Error("Empty response from Gemini API");
      }

      return { text: reply.trim() };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      if (msg.includes("429")) return { text: "Gemini API rate limit hit — try again in a few seconds." };
      return { text: `Gemini API error: ${msg}` };
    }
  });
