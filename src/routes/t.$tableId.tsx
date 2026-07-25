import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MENU, type MenuItem, type Order, type OrderStatus } from "@/lib/mock-data";
import { publish, subscribe } from "@/lib/realtime";
import { toast } from "sonner";

export const Route = createFileRoute("/t/$tableId")({
  head: ({ params }) => ({
    meta: [
      { title: `Table ${params.tableId} · Order · SmartServe` },
      {
        name: "description",
        content:
          "Scan-to-order at your table. Live menu availability, instant kitchen sync, real-time order status.",
      },
      { property: "og:title", content: `SmartServe · Table ${params.tableId}` },
      {
        property: "og:description",
        content: "Order from your phone, watch it hit the kitchen live.",
      },
    ],
  }),
  component: TableOrder,
});

const CATEGORIES = ["Starters", "Mains", "Desserts", "Drinks"] as const;

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "queued", label: "Placed" },
  { key: "preparing", label: "Preparing" },
  { key: "ready", label: "Ready" },
  { key: "served", label: "Served" },
];

function TableOrder() {
  const { tableId } = Route.useParams();
  const tableLabel = tableId.toUpperCase();

  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Mains");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [order, setOrder] = useState<Order | null>(null);

  const items = useMemo(() => MENU.filter((m) => m.category === category), [category]);
  const cartLines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const m = MENU.find((x) => x.id === id);
          return m ? { ...m, qty } : null;
        })
        .filter(Boolean) as (MenuItem & { qty: number })[],
    [cart],
  );
  const total = cartLines.reduce((s, l) => s + l.price * l.qty, 0);
  const count = cartLines.reduce((s, l) => s + l.qty, 0);

  // Subscribe to realtime status updates for this specific order.
  useEffect(() => {
    if (!order) return;
    const off = subscribe((e) => {
      if (e.type === "order:status" && e.id === order.id) {
        setOrder((o) => (o ? { ...o, status: e.status } : o));
        toast(`Order ${e.status}`, { description: `#${order.id}` });
      }
    });
    return off;
  }, [order]);

  function add(item: MenuItem) {
    if (item.available === 0) return;
    setCart((c) => ({ ...c, [item.id]: (c[item.id] ?? 0) + 1 }));
  }
  function remove(id: string) {
    setCart((c) => {
      const next = { ...c };
      if (!next[id]) return c;
      next[id] -= 1;
      if (next[id] <= 0) delete next[id];
      return next;
    });
  }

  function place() {
    if (cartLines.length === 0) return;
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      table: tableLabel,
      items: cartLines.map((l) => ({ name: l.name, qty: l.qty })),
      status: "queued",
      minutes: 0,
      total,
    };
    setOrder(newOrder);
    setCart({});
    publish({ type: "order:new", order: newOrder });
    toast.success("Sent to kitchen", { description: `#${newOrder.id}` });
  }

  if (order) {
    return <LiveStatus order={order} tableLabel={tableLabel} onNew={() => setOrder(null)} />;
  }

  return (
    <div className="min-h-screen bg-background pb-40">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-border">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted">
              The Nook · Scan-to-Order
            </span>
            <h1 className="font-display italic text-3xl leading-none mt-1">
              Table {tableLabel}
            </h1>
          </div>
          <span className="inline-flex items-center gap-2 px-2.5 py-1 border border-border rounded-full">
            <span className="size-1.5 rounded-full bg-accent pulse-status" />
            <span className="text-[9px] font-mono uppercase tracking-widest">ws · live</span>
          </span>
        </div>
        <div className="max-w-2xl mx-auto px-5 pb-3 flex gap-1 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={
                "px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest whitespace-nowrap transition-colors " +
                (c === category
                  ? "bg-foreground text-background"
                  : "border border-border text-muted hover:text-foreground")
              }
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      {/* Menu list */}
      <main className="max-w-2xl mx-auto px-5 pt-5 space-y-3">
        {items.map((item) => {
          const inCart = cart[item.id] ?? 0;
          const out = item.available === 0;
          return (
            <article
              key={item.id}
              className={
                "bg-card border border-border rounded-2xl overflow-hidden flex gap-3 " +
                (out ? "opacity-60" : "")
              }
            >
              <img
                src={item.image}
                alt={item.name}
                width={200}
                height={200}
                loading="lazy"
                className="w-24 h-24 object-cover shrink-0"
              />
              <div className="flex-1 py-3 pr-3 flex flex-col gap-1.5">
                <div className="flex justify-between items-start gap-3">
                  <h3 className="font-semibold text-sm leading-tight">{item.name}</h3>
                  <span className="font-mono text-primary text-sm shrink-0">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-muted leading-snug line-clamp-2">
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  {out ? (
                    <span className="text-[9px] font-mono text-destructive uppercase tracking-widest">
                      86'd tonight
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono text-accent uppercase tracking-widest">
                      <span className="size-1 rounded-full bg-accent pulse-status" />
                      {item.available} left
                    </span>
                  )}
                  {inCart > 0 ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => remove(item.id)}
                        className="size-7 rounded-full border border-border text-sm leading-none"
                        aria-label="Remove"
                      >
                        −
                      </button>
                      <span className="font-mono text-xs w-4 text-center">{inCart}</span>
                      <button
                        onClick={() => add(item)}
                        disabled={out}
                        className="size-7 rounded-full bg-foreground text-background text-sm leading-none"
                        aria-label="Add"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => add(item)}
                      disabled={out}
                      className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-foreground text-background disabled:opacity-40"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </main>

      {/* Sticky cart bar */}
      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur">
          <div className="max-w-2xl mx-auto px-5 py-3 flex items-center gap-3">
            <div className="flex-1">
              <div className="text-[9px] font-mono uppercase tracking-widest text-muted">
                {count} item{count === 1 ? "" : "s"} · Table {tableLabel}
              </div>
              <div className="font-display italic text-2xl leading-none mt-0.5">
                ${total.toFixed(2)}
              </div>
            </div>
            <button
              onClick={place}
              className="px-5 py-3 rounded-full bg-primary text-primary-foreground text-[11px] font-mono uppercase tracking-widest hover:opacity-90"
            >
              Send to kitchen →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function LiveStatus({
  order,
  tableLabel,
  onNew,
}: {
  order: Order;
  tableLabel: string;
  onNew: () => void;
}) {
  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-2xl mx-auto px-5 py-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted">
              Table {tableLabel} · Order sent
            </span>
            <h1 className="font-display italic text-3xl leading-none mt-1">
              #{order.id}
            </h1>
          </div>
          <span className="inline-flex items-center gap-2 px-2.5 py-1 border border-border rounded-full">
            <span className="size-1.5 rounded-full bg-accent pulse-status" />
            <span className="text-[9px] font-mono uppercase tracking-widest">ws · live</span>
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 py-6 space-y-6">
        {/* Status timeline */}
        <section className="bg-card border border-border rounded-2xl p-5">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-4">
            Live Status
          </div>
          <ol className="relative border-l-2 border-border ml-2 space-y-4">
            {STATUS_STEPS.map((s, i) => {
              const done = i <= currentIdx;
              const active = i === currentIdx;
              return (
                <li key={s.key} className="pl-5 relative">
                  <span
                    className={
                      "absolute -left-[9px] top-1 size-4 rounded-full border-2 " +
                      (done
                        ? "bg-accent border-accent " + (active ? "pulse-status" : "")
                        : "bg-background border-border")
                    }
                  />
                  <div
                    className={
                      "text-sm font-medium " + (done ? "text-foreground" : "text-muted")
                    }
                  >
                    {s.label}
                  </div>
                  {active && (
                    <div className="text-[10px] font-mono uppercase tracking-widest text-primary mt-0.5">
                      In progress…
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        {/* Order summary */}
        <section className="bg-card border border-border rounded-2xl p-5">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-3">
            Your Order
          </div>
          <div className="space-y-2">
            {order.items.map((i, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <span>
                  <span className="font-mono text-primary mr-2">{i.qty}×</span>
                  {i.name}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-3 mt-3 flex justify-between font-mono text-sm">
              <span>Total</span>
              <span className="text-primary">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </section>

        <button
          onClick={onNew}
          className="w-full py-3 rounded-full border border-border text-[11px] font-mono uppercase tracking-widest hover:bg-secondary"
        >
          + Add another round
        </button>

        <p className="text-center text-[10px] font-mono uppercase tracking-widest text-muted">
          Manager advances status live from the dashboard →
        </p>
      </main>
    </div>
  );
}
