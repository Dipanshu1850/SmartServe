import { createServerFn } from "@tanstack/react-start";
import { generateText } from "ai";
import { z } from "zod";

const SYSTEM = `You are the SmartServe Ops Copilot — an AI assistant embedded inside a fine-dining restaurant OS ("The Nook", a modern American bistro).
You help the manager with staffing, inventory, demand forecasting, menu engineering, and shift-by-shift decisions.

Ground your answers in this live context (mocked demo data, treat as authoritative):
- Tonight: 128 covers so far, $4,820 revenue, avg ticket $37.65, turn time 42m.
- Top items this week: Amber Sour (118), Tagliatelle (84), Burrata (62), Sea Bass (48), Ribeye (31).
- Peak hours: 7–8pm (52-61 covers/hr). Slowest slot: Tue/Wed 5–6pm.
- Inventory alerts: Wagyu Ribeye 0.4kg (reorder@5), Truffle Butter 1.1kg (reorder@1.5).
- 86'd tonight: Wagyu Ribeye (sold out).
- Weekend trend: Fri 172 covers, Sat 198 covers, Sun 142 covers.

Style: crisp, operator-friendly, no fluff. Prefer 2-4 short sentences.
Give a concrete recommendation with a number when possible. Use $ and unit qualifiers.
Never mention that you are an AI or that data is mocked.`;

const Input = z.object({ question: z.string().min(1).max(500) });

export const askCopilot = createServerFn({ method: "POST" })
  .inputValidator((v: unknown) => Input.parse(v))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { text: "AI Copilot is not configured. Ask an admin to enable the Lovable AI Gateway." };

    try {
      const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
      const gateway = createLovableAiGatewayProvider(key);
      const { text } = await generateText({
        model: gateway("google/gemini-3.6-flash"),
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: data.question },
        ],
      });
      return { text: text.trim() };
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      if (msg.includes("429")) return { text: "Rate limit hit — try again in a few seconds." };
      if (msg.includes("402")) return { text: "AI credits exhausted. Top up in workspace billing." };
      return { text: `Copilot error: ${msg}` };
    }
  });
