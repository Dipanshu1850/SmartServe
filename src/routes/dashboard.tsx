import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SiteNav } from "@/components/SiteNav";
import {
  HOURLY,
  INVENTORY,
  ORDERS,
  SALES_BY_DAY,
  TABLES,
  TOP_ITEMS,
  type Order,
  type OrderStatus,
} from "@/lib/mock-data";
import { publish, subscribe } from "@/lib/realtime";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Manager Dashboard · SmartServe" },
      {
        name: "description",
        content:
          "Live orders Kanban, table floor map, inventory, staff, sales analytics, and the AI Ops Copilot.",
      },
      { property: "og:title", content: "SmartServe Manager Dashboard" },
      {
        property: "og:description",
        content: "Operational intelligence for restaurant managers.",
      },
    ],
  }),
  component: Dashboard,
});

const TABS = ["Overview", "Orders", "Tables", "Inventory", "Copilot"] as const;

function Dashboard() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-4">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted">
              The Nook · Dinner Shift
            </span>
            <h1 className="font-display text-5xl italic mt-2">Command line.</h1>
          </div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded-full">
            <span className="size-1.5 rounded-full bg-accent pulse-status" />
            <span className="text-[10px] font-mono uppercase tracking-widest">Live</span>
          </span>
        </div>
        <div className="flex gap-1 mt-4 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={
                "px-4 py-2 rounded-full text-[11px] font-mono uppercase tracking-widest transition-colors " +
                (t === tab
                  ? "bg-foreground text-background"
                  : "border border-border text-muted hover:text-foreground")
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pb-24 pt-6">
        {tab === "Overview" && <Overview />}
        {tab === "Orders" && <OrdersKanban />}
        {tab === "Tables" && <TablesMap />}
        {tab === "Inventory" && <InventoryList />}
        {tab === "Copilot" && <Copilot />}
      </main>
    </div>
  );
}

function KpiCard({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted">{label}</div>
      <div className="font-display italic text-3xl mt-2">{value}</div>
      {delta && <div className="text-[10px] font-mono text-accent mt-1">{delta}</div>}
    </div>
  );
}

function Overview() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Revenue today" value="$4,820" delta="↑ 12% vs last Sat" />
        <KpiCard label="Covers" value="128" delta="↑ 8%" />
        <KpiCard label="Avg. ticket" value="$37.65" />
        <KpiCard label="Turn time" value="42m" delta="↓ 6m" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex justify-between items-baseline mb-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted">
                Revenue · Last 7 days
              </div>
              <div className="font-display italic text-2xl mt-1">$34,600</div>
            </div>
            <span className="text-[10px] font-mono text-accent">↑ 14% WoW</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={SALES_BY_DAY}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 0% / 0.06)" />
                <XAxis dataKey="day" fontSize={11} stroke="currentColor" opacity={0.5} />
                <YAxis fontSize={11} stroke="currentColor" opacity={0.5} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)",
                    color: "var(--color-surface-foreground)",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                />
                <Bar dataKey="revenue" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-3">
            Peak hours · tonight
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={HOURLY}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 0% / 0.06)" />
                <XAxis dataKey="hr" fontSize={11} stroke="currentColor" opacity={0.5} />
                <YAxis fontSize={11} stroke="currentColor" opacity={0.5} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)",
                    color: "var(--color-surface-foreground)",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="covers"
                  stroke="var(--color-accent)"
                  strokeWidth={2.5}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-4">
            Top items · this week
          </div>
          <ul className="space-y-3">
            {TOP_ITEMS.map((t) => (
              <li key={t.name} className="flex items-center gap-3">
                <span className="text-sm flex-1">{t.name}</span>
                <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(t.sold / 120) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-muted w-8 text-right">
                  {t.sold}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2 bg-surface text-surface-foreground rounded-2xl p-6">
          <div className="text-[10px] font-mono uppercase tracking-widest text-primary mb-3">
            Smart Alerts
          </div>
          <ul className="space-y-3">
            {[
              "Table 4 has been waiting 12 min without an order — check in?",
              "Wagyu Ribeye stock is critical (0.4 kg). Auto-suggest 86 after 2 more orders.",
              "Kitchen ticket #ORD-1042 is 4 min behind avg. — reassign?",
            ].map((a) => (
              <li
                key={a}
                className="flex gap-3 items-start p-3 bg-white/5 border border-white/10 rounded-lg"
              >
                <span className="size-1.5 rounded-full bg-primary mt-2 pulse-status" />
                <span className="text-sm">{a}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  queued: "Queued",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
};

function OrdersKanban() {
  const [orders, setOrders] = useState<Order[]>(ORDERS);
  const cols: OrderStatus[] = ["queued", "preparing", "ready", "served"];

  function advance(id: string) {
    setOrders((os) =>
      os.map((o) => {
        if (o.id !== id) return o;
        const next: Record<OrderStatus, OrderStatus> = {
          queued: "preparing",
          preparing: "ready",
          ready: "served",
          served: "served",
        };
        return { ...o, status: next[o.status] };
      }),
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cols.map((c) => {
        const list = orders.filter((o) => o.status === c);
        return (
          <div key={c} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex justify-between items-center border-b border-border pb-2 mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest">
                {STATUS_LABELS[c]}
              </span>
              <span className="text-[10px] font-mono text-muted">{list.length}</span>
            </div>
            <div className="space-y-2">
              {list.map((o) => (
                <button
                  key={o.id}
                  onClick={() => advance(o.id)}
                  className="w-full text-left p-3 bg-secondary hover:bg-primary/10 rounded-lg border border-border transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px] text-primary">#{o.id}</span>
                    <span className="text-[10px] font-mono text-muted">
                      {o.table} · {o.minutes}m
                    </span>
                  </div>
                  <p className="text-xs">
                    {o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-muted">
                      ${o.total.toFixed(0)}
                    </span>
                    {c !== "served" && (
                      <span className="text-[10px] font-mono text-primary">Advance →</span>
                    )}
                  </div>
                </button>
              ))}
              {list.length === 0 && (
                <p className="text-xs text-muted italic text-center py-6">Empty</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const tableColor: Record<string, string> = {
  free: "bg-accent/20 border-accent/40 text-accent",
  occupied: "bg-primary/20 border-primary/40 text-primary",
  reserved: "bg-foreground/10 border-foreground/30 text-foreground",
  cleaning: "bg-muted/10 border-border text-muted",
};

function TablesMap() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-4">
          Floor Map · Dinner
        </div>
        <div className="relative w-full aspect-[16/10] bg-secondary rounded-xl border border-border overflow-hidden">
          {TABLES.map((t) => (
            <div
              key={t.id}
              style={{ left: `${t.x}%`, top: `${t.y}%` }}
              className={
                "absolute -translate-x-1/2 -translate-y-1/2 size-16 rounded-full border-2 flex flex-col items-center justify-center " +
                tableColor[t.status]
              }
            >
              <span className="font-mono text-[10px] font-bold">{t.id}</span>
              <span className="text-[9px] opacity-70">{t.seats} seats</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-4">
          Legend
        </div>
        <ul className="space-y-3 text-sm">
          {(["free", "occupied", "reserved", "cleaning"] as const).map((s) => (
            <li key={s} className="flex items-center gap-3">
              <span className={"size-4 rounded-full border-2 " + tableColor[s]} />
              <span className="capitalize">{s}</span>
              <span className="ml-auto font-mono text-[10px] text-muted">
                {TABLES.filter((t) => t.status === s).length}
              </span>
            </li>
          ))}
        </ul>
        <div className="border-t border-border mt-6 pt-6">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-2">
            Auto-Assign Next
          </div>
          <p className="text-sm">
            Party of 2 → <span className="text-primary font-mono">T-01</span>
          </p>
          <p className="text-sm mt-1">
            Party of 4 → <span className="text-primary font-mono">T-06</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function InventoryList() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border text-[10px] font-mono uppercase tracking-widest text-muted">
        <span className="col-span-4">Item</span>
        <span className="col-span-2">On hand</span>
        <span className="col-span-3">Stock level</span>
        <span className="col-span-2">Reorder at</span>
        <span className="col-span-1 text-right">Alert</span>
      </div>
      {INVENTORY.map((i) => {
        const pct = Math.min(100, (i.qty / (i.reorderAt * 2)) * 100);
        const low = i.qty < i.reorderAt;
        return (
          <div
            key={i.id}
            className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-border items-center"
          >
            <div className="col-span-4">
              <div className="font-medium">{i.name}</div>
              <div className="text-[10px] font-mono text-muted uppercase">{i.supplier}</div>
            </div>
            <span className="col-span-2 font-mono text-sm">
              {i.qty} {i.unit}
            </span>
            <div className="col-span-3">
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={"h-full " + (low ? "bg-destructive" : "bg-accent")}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <span className="col-span-2 font-mono text-[11px] text-muted">
              {i.reorderAt} {i.unit}
            </span>
            <span className="col-span-1 text-right">
              {low ? (
                <span className="text-[10px] font-mono text-destructive uppercase tracking-widest">
                  ● Low
                </span>
              ) : (
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest">
                  ● OK
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}

type Msg = { role: "user" | "ai"; text: string; chart?: number[] };

function Copilot() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "user",
      text: "What were my slowest hours last week and why?",
    },
    {
      role: "ai",
      text: "Tuesday & Wednesday 5–6 PM were slowest (avg 12 covers). Cause: 78% of walk-ins that hour requested Ribeye — which was 86'd twice. Recommend: pre-stage 4 ribeyes at 4:30 PM or feature Tagliatelle as the early-bird special.",
      chart: [12, 14, 11, 16, 42, 61],
    },
  ]);
  const [input, setInput] = useState("");

  const suggested = [
    "Forecast next Friday's Ribeye demand",
    "Which server has the highest avg ticket?",
    "Any inventory I should reorder today?",
  ];

  function send(text: string) {
    if (!text.trim()) return;
    const answer: Msg = {
      role: "ai",
      text: aiReply(text),
      chart: [30, 45, 22, 60, 78, 55],
    };
    setMessages((m) => [...m, { role: "user", text }, answer]);
    setInput("");
  }

  const historyPreview = useMemo(() => messages.slice(-6), [messages]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-surface text-surface-foreground rounded-2xl p-6 flex flex-col h-[70vh]">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
          <span className="size-2 rounded-full bg-primary pulse-status" />
          <span className="text-[10px] font-mono uppercase tracking-widest">
            Ops Copilot · Gemini 3 Flash
          </span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {historyPreview.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={
                  "max-w-[80%] rounded-2xl p-4 " +
                  (m.role === "user"
                    ? "bg-primary/20 border border-primary/30 rounded-tr-sm"
                    : "bg-white/5 border border-white/10 rounded-tl-sm")
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
            placeholder="Ask about sales, inventory, staff, forecasts…"
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:border-primary/50"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-[11px] font-mono uppercase tracking-widest"
          >
            Ask
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-3">
            Try asking
          </div>
          <div className="space-y-2">
            {suggested.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="w-full text-left text-sm p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-3">
            Forecast preview
          </div>
          <p className="font-display italic text-xl leading-snug">
            Next Fri projected: <span className="text-primary">198 covers</span> · $8.2k rev.
          </p>
          <p className="text-xs text-muted mt-3">
            Restock ribeye (+6kg) and burrata (+15pcs) by Thu 4 PM.
          </p>
        </div>
      </div>
    </div>
  );
}

function aiReply(q: string): string {
  const s = q.toLowerCase();
  if (s.includes("forecast") || s.includes("demand"))
    return "Next Friday projects 198 covers (~$8.2k). Ribeye demand +18% — reorder 6kg by Thu 4 PM. Burrata trending; keep 15+ pcs on hand.";
  if (s.includes("server") || s.includes("staff"))
    return "Amelia leads on avg ticket ($52.40) driven by wine pairings. Consider assigning her to Table 12 (top spenders) tonight.";
  if (s.includes("reorder") || s.includes("inventory"))
    return "Reorder today: Wagyu Ribeye (0.4 kg → 6 kg), Truffle Butter (1.1 → 3 kg). Sea Bass and Burrata OK through Sunday.";
  return "Analyzing… Tuesday 5–6 PM is your softest slot. Ribeye 86's caused 40% of walk-away. Try an early-bird Tagliatelle special.";
}
