import { useEffect, useRef } from "react";
import { useAI } from "../hooks/useAI";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function OpsCopilot() {
  const { user } = useAuth();
  const role = user?.role || "customer";

  const {
    historyPreview,
    input,
    setInput,
    pending,
    send,
    suggested,
  } = useAI();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [historyPreview.length, pending]);

  const copilotTitles: Record<string, string> = {
    customer: "AI Sommelier · Food Assistant",
    staff: "Shift Assistant · Cooking Ops",
    manager: "Ops Copilot · Restaurant Health",
    owner: "Business Advisor · Strategic Growth",
  };

  const title = copilotTitles[role] || copilotTitles.customer;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-[#121214] border border-[#1e1e24] text-surface-foreground rounded-2xl p-6 flex flex-col h-[65vh]">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
          <span className="size-2 rounded-full bg-primary pulse-status" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa]">
            {title}
          </span>
        </div>
        <div ref={listRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
          {historyPreview.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  "max-w-[80%] rounded-2xl p-4 " +
                  (m.role === "user"
                    ? "bg-primary/20 border border-primary/30 rounded-tr-sm text-white"
                    : "bg-white/5 border border-white/10 rounded-tl-sm text-white/90")
                }
              >
                <p className="text-sm leading-relaxed">{m.text}</p>
                {m.chart && (
                  <div className="flex items-end gap-1 h-16 mt-3">
                    {m.chart.map((h, j) => (
                      <div
                        key={j}
                        className={
                          j === m.chart!.indexOf(Math.max(...m.chart!))
                            ? "flex-1 bg-primary rounded-t-sm"
                            : "flex-1 bg-white/20 rounded-t-sm"
                        }
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {pending && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl p-4 bg-white/5 border border-white/10 rounded-tl-sm">
                <p className="text-sm text-white/60 font-mono">Thinking…</p>
              </div>
            </div>
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-white/10 pt-4 mt-4 flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={pending}
            placeholder="Ask anything..."
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={pending}
            className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-[11px] font-mono uppercase tracking-widest disabled:opacity-60 cursor-pointer"
          >
            {pending ? "…" : "Ask"}
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <div className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-5">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa] mb-3">
            Try asking
          </div>
          <div className="space-y-2">
            {suggested.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="w-full text-left text-sm p-3 rounded-lg border border-[#1e1e24] text-[#e4e4e7] hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        {role === "manager" || role === "owner" ? (
          <div className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-5">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa] mb-3">
              Forecast preview
            </div>
            <p className="font-display italic text-xl leading-snug text-white">
              Next Fri projected: <span className="text-primary">198 covers</span> · ₹82k rev.
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Restock paneer (+12kg) and chicken (+25kg) by Thu 4 PM.
            </p>
          </div>
        ) : (
          <div className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-5">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa] mb-3">
              Daily Special
            </div>
            <p className="font-display italic text-xl leading-snug text-white">
              Chef's Choice: <span className="text-primary">Tandoori Paneer Tikka</span>.
            </p>
            <p className="text-xs text-muted-foreground mt-3">
              Clay oven-roasted paneer with bell peppers and mint chutney.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
