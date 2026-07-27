import { useState, useMemo } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { askCopilot } from "../services/ai.service";

export type Msg = { role: "user" | "ai"; text: string; chart?: number[] };

const DEFAULT_MESSAGES: Record<string, Msg[]> = {
  customer: [
    { role: "user", text: "What should I pair with Classic Butter Chicken?" },
    { role: "ai", text: "Try a Mango Lassi with the Classic Butter Chicken. Its sweet, cooling yogurt and mango balance the rich tomato-butter gravy and fenugreek." }
  ],
  staff: [
    { role: "user", text: "Which tables need water refills?" },
    { role: "ai", text: "Table T-12 and Table T-08 have been occupied for over 25 minutes without drink updates. Please check if they would like water or another round of Amber Sours." }
  ],
  manager: [
    { role: "user", text: "What were my slowest hours last week and why?" },
    { role: "ai", text: "Tuesday & Wednesday 5–6 PM were slowest (avg 12 covers). Cause: 78% of walk-ins that hour requested Ribeye — which was 86'd twice. Recommend: pre-stage 4 ribeyes at 4:30 PM or feature Tagliatelle as the early-bird special.", chart: [12, 14, 11, 16, 42, 61] }
  ],
  owner: [
    { role: "user", text: "Which branch had the highest MRR profit margin last month?" },
    { role: "ai", text: "The Nook (Brooklyn) led with $148k MRR and a 24.2% net profit margin, followed by Olive & Ember (LA) at $112k MRR. Recommend matching Brooklyn's server incentives in Austin to bump performance." }
  ]
};

export function useAI() {
  const { user } = useAuth();
  const role = user?.role || "customer";

  const [messages, setMessages] = useState<Msg[]>(() => {
    return DEFAULT_MESSAGES[role] || DEFAULT_MESSAGES.customer;
  });
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);

  const suggestedByRole: Record<string, string[]> = {
    customer: [
      "Recommend a vegetarian starter",
      "Is the Wagyu Ribeye available tonight?",
      "Suggest a dessert pairing"
    ],
    staff: [
      "Show tables waiting for orders",
      "Which items are currently 86'd?",
      "Next side station duties checklist"
    ],
    manager: [
      "Forecast next Friday's Ribeye demand",
      "Which server has the highest avg ticket?",
      "Any inventory I should reorder today?"
    ],
    owner: [
      "Show company MRR performance summaries",
      "Analyze employee check averages",
      "Suggest marketing campaigns for Terra Cotta"
    ]
  };

  const suggested = suggestedByRole[role] || suggestedByRole.customer;

  async function send(text: string) {
    if (!text.trim() || pending) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setPending(true);
    try {
      const { text: reply } = await askCopilot({ data: { question: text, role } });
      setMessages((m) => [
        ...m,
        { role: "ai", text: reply, chart: role === "manager" || role === "owner" ? [30, 45, 22, 60, 78, 55] : undefined },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setMessages((m) => [...m, { role: "ai", text: `Copilot offline — ${msg}` }]);
    } finally {
      setPending(false);
    }
  }

  const historyPreview = useMemo(() => messages.slice(-8), [messages]);

  return {
    messages,
    historyPreview,
    input,
    setInput,
    pending,
    send,
    suggested,
  };
}
