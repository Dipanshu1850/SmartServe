import { type Ticket } from "../types/staff.types";

export function TicketCard({
  t,
  now,
  onBump,
  onRecall,
}: {
  t: Ticket;
  now: number;
  onBump: (t: Ticket) => void;
  onRecall: (t: Ticket) => void;
}) {
  const elapsedMs = Math.max(0, now - t.openedAt);
  const mins = Math.floor(elapsedMs / 60_000);
  const secs = Math.floor((elapsedMs % 60_000) / 1000);
  const late = mins >= 15;
  const warn = mins >= 10 && !late;

  const border = late
    ? "border-destructive"
    : warn
    ? "border-primary/60"
    : "border-white/15";

  return (
    <article className={`bg-white/5 border ${border} rounded-2xl p-4 space-y-3`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-white/50">
            {t.id}
          </div>
          <div className="font-display italic text-2xl text-white leading-tight">{t.table}</div>
        </div>
        <div className="text-right">
          <div
            className={
              "font-mono text-2xl tabular-nums " +
              (late ? "text-destructive" : warn ? "text-primary" : "text-white/90")
            }
          >
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </div>
          <div className="text-[9px] font-mono uppercase tracking-widest text-white/40">
            {late ? "Late" : warn ? "Push" : "On time"}
          </div>
        </div>
      </div>

      <ul className="space-y-1 text-sm">
        {t.items.map((it, i) => (
          <li key={i} className="flex justify-between border-b border-white/5 py-1">
            <span className="text-white/90">{it.name}</span>
            <span className="font-mono text-white/80">×{it.qty}</span>
          </li>
        ))}
      </ul>

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onRecall(t)}
          className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest border border-white/15 rounded-full hover:bg-white/5"
        >
          ← Recall
        </button>
        <button
          onClick={() => onBump(t)}
          className={
            "flex-1 py-2 rounded-full text-[10px] font-mono uppercase tracking-widest " +
            (t.status === "ready"
              ? "bg-accent text-surface"
              : "bg-primary text-primary-foreground")
          }
        >
          {t.status === "queued" && "Start cooking →"}
          {t.status === "preparing" && "Bump to pass →"}
          {t.status === "ready" && "Mark served ✓"}
        </button>
      </div>
    </article>
  );
}
