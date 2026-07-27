import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { COPILOT_SYSTEM_PROMPT } from "../prompts/copilot.prompt";
import { MENU, ORDERS, TABLES, INVENTORY, TOP_ITEMS, SALES_BY_DAY, HOURLY, RESERVATIONS } from "@/lib/mock-data";

const Input = z.object({
  question: z.string().min(1).max(500),
  role: z.enum(["customer", "staff", "manager", "owner"]).optional(),
});

const InventoryInput = z.object({
  itemId: z.string().min(1).max(50),
});

const ROLE_PROMPTS: Record<string, string> = {
  customer: "You are the Guest Sommelier & Food Assistant. Focus on menu suggestions, ingredients, dietary details, wine pairings, and reservation booking help. Be warm, welcoming, and hospitable.",
  staff: "You are the Staff Operations Assistant. Help coordinate active tickets, check server checklists, monitor customer requests, and table turnaround efficiency. Be extremely brief, operational, and speed-oriented.",
  manager: "You are the Operations Copilot. Focus on smart alerts, inventory stock levels, labor costs, peak hour wait times, and kitchen queue velocity. Be analytical, data-driven, and recommendation-focused.",
  owner: "You are the Strategic Executive Advisor. Help analyze monthly revenue, profitability margins, multi-branch comparisons, labor percentages, and marketing campaign outcomes. Be professional, financial-savvy, and growth-oriented.",
};

function loadGeminiKey() {
  const key = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
  return key || null;
}

async function callGeminiGenerateText({
  key,
  promptText,
  jsonMode,
}: {
  key: string;
  promptText: string;
  jsonMode?: boolean;
}): Promise<string> {
  const modelsToTry = [
    "models/gemini-3.6-flash",
    "models/gemini-3.5-flash",
    "models/gemini-3.5-flash-lite",
    "models/gemini-3.1-flash-lite",
  ];

  let lastErr: unknown = null;

  for (const modelName of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${key}`;
    const parts = jsonMode
      ? [
          { text: promptText + "\n\nCRITICAL OUTPUT RULE: Respond with ONLY valid JSON. No markdown code fences. No prose before or after the JSON. No explanatory text. Just parseable JSON text content." },
        ]
      : [{ text: promptText }];
    const body: any = {
      contents: [{ parts }],
      ...(jsonMode ? { response_mime_type: "application/json" } : {}),
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        lastErr = new Error(`HTTP ${response.status} on ${modelName}`);
        continue;
      }

      const resData = await response.json();
      const reply =
        resData?.candidates?.[0]?.content?.parts?.[0]?.text ??
        resData?.candidates?.[0]?.output?.[0]?.content?.[0]?.text ??
        resData?.output?.[0]?.content?.[0]?.text ??
        resData?.message?.content?.[0]?.text ??
        resData?.text;
      if (typeof reply === "string" && reply.trim().length > 0) return reply.trim();
    } catch (err) {
      lastErr = err;
      continue;
    }
  }

  // Final fallback: try list models
  try {
    const listUrl = `https://generativelanguage.googleapis.com/v1/models?pageSize=1000&key=${key}`;
    const listResp = await fetch(listUrl, { method: "GET" });
    if (listResp.ok) {
      const listData = await listResp.json().catch(() => ({}));
      const candidates = Array.isArray(listData.models) ? listData.models : [];
      for (const m of candidates) {
        const name = String(m?.name || "");
        if (!name.startsWith("models/gemini-")) continue;
        const supported = Array.isArray(m?.supportedGenerationMethods) ? m.supportedGenerationMethods : [];
        if (!supported.includes("generateContent")) continue;
        const url = `https://generativelanguage.googleapis.com/v1/${name}:generateContent?key=${key}`;
        const parts = jsonMode
          ? [
              { text: promptText + "\n\nCRITICAL OUTPUT RULE: Respond with ONLY valid JSON. No markdown code fences. No prose before or after the JSON. No explanatory text. Just parseable JSON text content." },
            ]
          : [{ text: promptText }];
        const body = {
          contents: [{ parts }],
          ...(jsonMode ? { response_mime_type: "application/json" } : {}),
        };
        const resp = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!resp.ok) continue;
        const resData = await resp.json().catch(() => ({}));
        const reply = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (typeof reply === "string" && reply.trim().length > 0) return reply.trim();
      }
    }
  } catch (err) {
    lastErr = err;
  }

  throw lastErr instanceof Error ? lastErr : new Error("Gemini call failed across all models");
}

function stripFences(s: string) {
  return s
    .replace(/^\uFEFF/, "")
    .replace(/^```(?:json|JSON)?\s*/i, "")
    .replace(/```$/, "")
    .trim();
}

export const askCopilot = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => Input.parse(v))
  .handler(async ({ data }) => {
    const key = loadGeminiKey();
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
      const reply = await callGeminiGenerateText({ key, promptText });
      return { text: reply };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      if (msg.includes("429")) return { text: "Gemini API rate limit hit — try again in a few seconds." };
      return { text: `Gemini API error: ${msg}` };
    }
  });

export type InventorySuggestion = {
  itemId: string;
  name: string;
  supplier: string;
  suggestedQty: number;
  unit: string;
  urgency: "Low" | "Medium" | "High" | "Critical";
  reason: string;
  etaDays: number;
};

export const inventorySuggestReorder = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => InventoryInput.parse(v))
  .handler(async ({ data }) => {
    const key = loadGeminiKey();
    const item = INVENTORY.find((i) => i.id === data.itemId);
    if (!item) return { error: "Item not found" };

    // Always provide a deterministic fallback so UI never shows "AI loading" forever
    const fallback: InventorySuggestion = {
      itemId: item.id,
      name: item.name,
      supplier: item.supplier,
      unit: item.unit,
      suggestedQty: Math.max(
        item.reorderAt * 2,
        item.reorderAt * 2 - item.qty > 0 ? Math.round(item.reorderAt * 2 - item.qty + item.reorderAt) : item.reorderAt * 2,
      ),
      urgency:
        item.qty === 0 ? "Critical" : item.qty < item.reorderAt / 2 ? "High" : item.qty < item.reorderAt ? "Medium" : "Low",
      reason: `${item.qty} ${item.unit} on hand vs reorder threshold ${item.reorderAt} ${item.unit}. Reordering ${Math.round(item.reorderAt * 2)} ${item.unit} covers ~2 weeks of typical throughput.`,
      etaDays: 3,
    };

    if (!key) return { ...fallback, note: "AI key not set (deterministic suggestion)" };

    try {
      const recentOrders = ORDERS.map((o) => `${o.id} x${o.items.reduce((s, l) => s + l.qty, 0)}`).join(", ");
      const last7 = SALES_BY_DAY.map((d) => `${d.day} INR${d.revenue}`).join(", ");
      const prompt = `You are an inventory procurement AI for a fine-dining restaurant. Analyze the following SKU and surrounding context, then output a single strict JSON object matching this schema:
{
  "itemId": string,
  "name": string,
  "supplier": string,
  "suggestedQty": number,
  "unit": string,
  "urgency": "Low" | "Medium" | "High" | "Critical",
  "reason": string,
  "etaDays": number
}

Context:
SKU: ${JSON.stringify(item)}
Entire on-hand inventory snapshot (for cross-referencing typical holding cost):
${JSON.stringify(INVENTORY)}
Recent 7-day revenue: ${last7}
Active orders count: ${ORDERS.length} (${recentOrders})
Top items sold trend: ${JSON.stringify(TOP_ITEMS)}

Return ONLY JSON. No fences. No extra words.`;

      const text = await callGeminiGenerateText({ key, promptText: prompt, jsonMode: true });
      const parsed = JSON.parse(stripFences(text));
      const out: InventorySuggestion = {
        itemId: String(parsed.itemId ?? item.id),
        name: String(parsed.name ?? item.name),
        supplier: String(parsed.supplier ?? item.supplier),
        suggestedQty: typeof parsed.suggestedQty === "number" ? parsed.suggestedQty : fallback.suggestedQty,
        unit: String(parsed.unit ?? item.unit),
        urgency: ["Low", "Medium", "High", "Critical"].includes(String(parsed.urgency))
          ? (parsed.urgency as InventorySuggestion["urgency"])
          : fallback.urgency,
        reason: String(parsed.reason ?? fallback.reason),
        etaDays: typeof parsed.etaDays === "number" ? parsed.etaDays : 3,
      };
      return out;
    } catch (err) {
      return { ...fallback, note: err instanceof Error ? `Fallback (AI: ${err.message})` : "Fallback" };
    }
  });

export type ManagerInsight = {
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  icon: "trending-up" | "alert" | "sparkle" | "clock";
};

export const managerDailyInsights = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => ({} as any))
  .handler(async () => {
    const key = loadGeminiKey();
    const fallback: ManagerInsight[] = [
      {
        title: "Demand Forecast",
        message: "Saturday 7–9 PM peak predicted above baseline. Recommend +2 floor staff to keep turn time under 45m.",
        type: "info",
        icon: "trending-up",
      },
      {
        title: "Inventory Alert",
        message: `${INVENTORY[0].name} stock critical (${INVENTORY[0].qty} ${INVENTORY[0].unit}). Suggested reorder: ${INVENTORY[0].reorderAt * 2} ${INVENTORY[0].unit} from ${INVENTORY[0].supplier}.`,
        type: "warning",
        icon: "alert",
      },
      {
        title: "Upsell Opportunity",
        message: `${TOP_ITEMS[0].name} is the #1 item tonight. Train servers to pair with Mango Lassi — observed +22% ticket lift elsewhere.`,
        type: "success",
        icon: "sparkle",
      },
    ];

    if (!key) return { cards: fallback, note: "AI key not set (deterministic insights)" };

    try {
      const snapshot = JSON.stringify({
        orders: ORDERS.map((o) => ({ id: o.id, table: o.table, total: o.total, status: o.status, minutes: o.minutes, items: o.items.length })),
        inventory: INVENTORY.map((i) => ({ id: i.id, name: i.name, qty: i.qty, reorderAt: i.reorderAt, supplier: i.supplier, unit: i.unit })),
        tables: TABLES.map((t) => ({ id: t.id, status: t.status, seats: t.seats })),
        salesByDay: SALES_BY_DAY,
        hourly: HOURLY,
        reservations: RESERVATIONS,
        topItems: TOP_ITEMS,
      });

      const prompt = `You are a Senior Restaurant Operations Analyst AI. Based on today's live operations snapshot below, output a single strict JSON array of exactly 3 high-impact manager insights. Each insight is an object:
{
  "title": string (max 30 chars),
  "message": string (max 240 chars),
  "type": "info" | "success" | "warning",
  "icon": "trending-up" | "alert" | "sparkle" | "clock"
}

Pick 3 distinct areas: (1) Demand forecast — tonight's peak + staff recommendation, (2) Inventory — most at-risk SKU with specific reorder suggestion, (3) Upsell/guest experience — a concrete server-briefable action tied to actual top-items data. Be specific and actionable. No generic advice. Cite numbers from the snapshot.

Operations snapshot:
${snapshot}

Return ONLY a valid JSON array of 3 objects. No markdown fences. No prose. No prefix or suffix text.`;

      const text = await callGeminiGenerateText({ key, promptText: prompt, jsonMode: true });
      const raw = JSON.parse(stripFences(text));
      const rawArr = Array.isArray(raw) ? raw : raw.insights ?? raw.cards ?? [];
      const cards: ManagerInsight[] = rawArr.slice(0, 3).map((o: any) => ({
        title: String(o.title || "Insight").slice(0, 50),
        message: String(o.message || "").slice(0, 260),
        type: ["info", "success", "warning"].includes(String(o.type)) ? (o.type as ManagerInsight["type"]) : "info",
        icon: ["trending-up", "alert", "sparkle", "clock"].includes(String(o.icon)) ? (o.icon as ManagerInsight["icon"]) : "sparkle",
      }));
      if (cards.length < 3) return { cards: fallback, note: "Fallback (AI returned < 3 cards)" };
      return { cards };
    } catch (err) {
      return { cards: fallback, note: err instanceof Error ? `Fallback (AI: ${err.message})` : "Fallback" };
    }
  });
