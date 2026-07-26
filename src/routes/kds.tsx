import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { RequireRole } from "@/lib/auth";
import { ORDERS, type Order, type OrderStatus } from "@/lib/mock-data";
import { publish, subscribe, useConnectionLabel } from "@/lib/realtime";

export const Route = createFileRoute("/kds")({
  head: () => ({
    meta: [
      { title: "Kitchen Display · SmartServe" },
      {
        name: "description",
        content: "Kitchen display system with live tickets, station timers, and bump-bar workflow.",
      },
      { property: "og:title", content: "SmartServe KDS" },
      { property: "og:description", content: "The pass, digitized. Bump, recall, expedite." },
    ],
  }),
  component: () => (
    <RequireRole roles={["server", "manager", "admin"]}>
      <KDS />
    </RequireRole>
  ),
});

type Ticket = Order & { openedAt: number };

const NEXT: Record<OrderStatus, OrderStatus> = {
  queued: "preparing",
  preparing: "ready",
  ready: "served",
  served: "served",
};

function KDS() {
  const conn = useConnectionLabel();
  const [tickets, setTickets] = useState<Ticket[]>(() =>
    ORDERS.filter((o) => o.status !== "served").map((o) => ({
      ...o,
      openedAt: Date.now() - o.minutes * 60_000,
    })),
  );
  const [now, setNow] = useState(Date.now());
  const [showServed, setShowServed] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    return subscribe((e) => {
      if (e.type === "order:new") {
        setTickets((t) => {
          if (t.some((x) => x.id === e.order.id)) return t;
          return [{ ...e.order, openedAt: Date.now() }, ...t];
        });
      }
      if (e.type === "order:status") {
        setTickets((t) => t.map((x) => (x.id === e.id ? { ...x, status: e.status } : x)));
      }
    });
  }, []);

  function bump(t: Ticket) {
    const next = NEXT[t.status];
    if (next === t.status) return;
    setTickets((list) => list.map((x) => (x.id === t.id ? { ...x, status: next } : x)));
    publish({ type: "order:status", id: t.id, status: next });
  }

  function recall(t: Ticket) {
    const order: OrderStatus[] = ["queued", "preparing", "ready", "served"];
    const prev = order[Math.max(0, order.indexOf(t.status) - 1)];
    setTickets((list) => list.map((x) => (x.id === t.id ? { ...x, status: prev } : x)));
    publish({ type: "order:status", id: t.id, status: prev });
  }

  const visible = useMemo(
    () => (showServed ? tickets : tickets.filter((t) => t.status !== "served")),
    [tickets, showServed],
  );

  const byStatus = useMemo(() => {
    return {
      queued: visible.filter((t) => t.status === "queued"),
      preparing: visible.filter((t) => t.status === "preparing"),
      ready: visible.filter((t) => t.status === "ready"),
    };
  }, [visible]);

  return (
    <div className="min-h-screen bg-surface text-surface-foreground">
      <SiteNav />
      <div className="max-w-[1600px] mx-auto px-6 pt-8 pb-4">
        <div className="flex items-end justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
              The Nook · Line
            </span>
            <h1 className="font-display text-5xl italic mt-2 text-white">The Pass.</h1>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-white/60">
              <input
                type="checkbox"
                checked={showServed}
                onChange={(e) => setShowServed(e.target.checked)}
              />
              Show served
            </label>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/15 rounded-full">
              <span className="size-1.5 rounded-full bg-primary pulse-status" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/80">
                {conn}
              </span>
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-[1600px] mx-auto px-6 pb-24 pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Column title="Queued" count={byStatus.queued.length} tint="text-white/60">
          {byStatus.queued.map((t) => (
            <TicketCard key={t.id} t={t} now={now} onBump={bump} onRecall={recall} />
          ))}
        </Column>
        <Column title="Preparing" count={byStatus.preparing.length} tint="text-primary">
          {byStatus.preparing.map((t) => (
            <TicketCard key={t.id} t={t} now={now} onBump={bump} onRecall={recall} />
          ))}
        </Column>
        <Column title="Ready · Pass" count={byStatus.ready.length} tint="text-accent">
          {byStatus.ready.map((t) => (
            <TicketCard key={t.id} t={t} now={now} onBump={bump} onRecall={recall} />
          ))}
        </Column>
      </main>
    </div>
  );
}

function Column({
  title,
  count,
  tint,
  children,
}: {
  title: string;
  count: number;
  tint: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <header className="flex items-baseline justify-between border-b border-white/10 pb-2">
        <span className={`text-[10px] font-mono uppercase tracking-widest ${tint}`}>{title}</span>
        <span className="font-display italic text-2xl">{count}</span>
      </header>
      <div className="space-y-3">{children}</div>
      {count === 0 && (
        <div className="text-[11px] font-mono uppercase tracking-widest text-white/30 py-6 text-center border border-dashed border-white/10 rounded-xl">
          Empty
        </div>
      )}
    </section>
  );
}

function TicketCard({
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
            <span>{it.name}</span>
            <span className="font-mono text-white/60">×{it.qty}</span>
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
