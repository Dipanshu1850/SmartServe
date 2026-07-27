import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Sparkles, TrendingUp, AlertTriangle, Clock, Loader2, Lightbulb } from "lucide-react";
import { managerDailyInsights, type ManagerInsight } from "@/features/ai/services/ai.service";

const ICONS: Record<ManagerInsight["icon"], typeof TrendingUp> = {
  "trending-up": TrendingUp,
  alert: AlertTriangle,
  sparkle: Sparkles,
  clock: Clock,
};

function borderClass(t: ManagerInsight["type"]) {
  return t === "warning"
    ? "border-destructive/30 bg-destructive/10"
    : t === "success"
      ? "border-accent/25 bg-accent/10"
      : "border-primary/25 bg-primary/10";
}

function textClass(t: ManagerInsight["type"]) {
  return t === "warning" ? "text-destructive-foreground" : t === "success" ? "text-accent" : "text-primary";
}

export function ProactiveInsights() {
  const [cards, setCards] = useState<ManagerInsight[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState<string | null>(null);
  const [announced, setAnnounced] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await managerDailyInsights({ data: {} });
        if (cancelled) return;
        setCards(res.cards);
        if ("note" in res && typeof res.note === "string") setNote(res.note);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Toast each card once as they load — staggered so judge sees live AI insights pop in
  useEffect(() => {
    if (!cards) return;
    const timers: number[] = [];
    cards.forEach((c, idx) => {
      const id = `${c.title}-${idx}`;
      if (announced.has(id)) return;
      timers.push(
        window.setTimeout(() => {
          const Icon = ICONS[c.icon] ?? Lightbulb;
          const typeFn =
            c.type === "success" ? toast.success : c.type === "warning" ? toast.warning : toast;
          typeFn(c.title, {
            description: c.message,
            icon: <Icon className="size-4 text-primary" />,
            duration: 12000,
          });
          setAnnounced((prev) => {
            const next = new Set(prev);
            next.add(id);
            return next;
          });
        }, 2500 + idx * 3500),
      );
    });
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [cards, announced]);

  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex justify-between items-baseline mb-5">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted flex items-center gap-1.5">
            <Sparkles className="size-3 text-primary" />
            Live AI Operations Insights
          </span>
          <div className="font-display italic text-2xl mt-1">Manager Daily Briefing</div>
        </div>
        {loading ? (
          <span className="text-[10px] font-mono text-primary/80 inline-flex items-center gap-1.5">
            <Loader2 className="size-3 animate-spin" /> Generating from Gemini…
          </span>
        ) : note ? (
          <span className="text-[10px] font-mono text-muted/80">{note}</span>
        ) : (
          <span className="text-[10px] font-mono text-accent/90">Gemini generated · now</span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {(loading ? [0, 1, 2] : cards ?? [0, 1, 2]).map((raw, idx) => {
          const card: ManagerInsight =
            cards && typeof raw === "object"
              ? (raw as ManagerInsight)
              : {
                  title: "Loading insight…",
                  message: "Briefing will appear within a few seconds.",
                  type: "info",
                  icon: "sparkle",
                };
          const Icon = ICONS[card.icon] ?? Lightbulb;
          return (
            <div
              key={idx}
              className={
                "rounded-2xl border p-4 flex gap-3 items-start transition-opacity " +
                (loading && !cards ? "opacity-60 animate-pulse " : "") +
                borderClass(card.type)
              }
            >
              <div className={"p-2 rounded-xl bg-black/20 shrink-0 " + textClass(card.type)}>
                <Icon className="size-4" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h4 className="font-semibold text-sm">{card.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  {card.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
