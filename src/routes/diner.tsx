import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { MENU, type MenuItem } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/diner")({
  head: () => ({
    meta: [
      { title: "Diner Experience · SmartServe" },
      {
        name: "description",
        content:
          "Scan-to-order live menu with real-time availability, AI recommendations, and instant order tracking.",
      },
      { property: "og:title", content: "SmartServe Diner Experience" },
      {
        property: "og:description",
        content: "Live availability, AI recommendations, transparent ordering.",
      },
    ],
  }),
  component: Diner,
});

const CATEGORIES = ["Starters", "Mains", "Desserts", "Drinks"] as const;

function Diner() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Mains");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [placed, setPlaced] = useState(false);

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

  function add(item: MenuItem) {
    if (item.available === 0) return;
    setCart((c) => ({ ...c, [item.id]: (c[item.id] ?? 0) + 1 }));
    toast(`Added ${item.name}`, { description: `$${item.price.toFixed(2)}` });
  }

  function place() {
    if (cartLines.length === 0) return;
    setPlaced(true);
    toast.success("Order sent to kitchen", { description: "Track live below" });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <header className="max-w-7xl mx-auto px-6 pt-12 pb-6">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted">
              The Nook · Brooklyn
            </span>
            <h1 className="font-display text-5xl italic mt-2">Tonight's menu.</h1>
          </div>
          <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 border border-border rounded-full">
            <span className="size-1.5 rounded-full bg-accent pulse-status" />
            <span className="text-[10px] font-mono uppercase tracking-widest">
              Table 14 · Scan Active
            </span>
          </span>
        </div>

        <div className="flex gap-1 mt-6 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={
                "px-4 py-2 rounded-full text-xs font-mono uppercase tracking-widest whitespace-nowrap transition-colors " +
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

      <main className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <section className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((item) => (
            <article
              key={item.id}
              className={
                "bg-card border border-border rounded-2xl overflow-hidden flex flex-col " +
                (item.available === 0 ? "opacity-60" : "")
              }
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  width={1024}
                  height={768}
                  loading="lazy"
                  className="w-full aspect-[4/3] object-cover"
                />
                {item.chefsChoice && (
                  <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded">
                    Chef's Choice
                  </span>
                )}
                {item.available === 0 && (
                  <div className="absolute inset-0 grid place-items-center bg-background/70 backdrop-blur-[1px]">
                    <span className="font-display italic text-2xl">86'd tonight</span>
                  </div>
                )}
              </div>
              <div className="p-5 flex-1 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-xs text-muted mt-1">{item.description}</p>
                  </div>
                  <span className="font-mono text-primary text-sm shrink-0">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {item.available > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-accent/5 border border-accent/20 rounded-full">
                      <span className="size-1.5 rounded-full bg-accent pulse-status" />
                      <span className="text-[10px] font-bold text-accent uppercase tracking-tighter">
                        {item.available} left
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 bg-destructive/5 border border-destructive/20 rounded-full text-[10px] font-bold text-destructive uppercase tracking-tighter">
                      Unavailable
                    </span>
                  )}
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono uppercase tracking-tighter text-muted border border-border px-2 py-0.5 rounded-full"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  disabled={item.available === 0}
                  onClick={() => add(item)}
                  className="mt-2 py-2 rounded-full text-[11px] font-mono uppercase tracking-widest bg-foreground text-background disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  Add to order
                </button>
              </div>
            </article>
          ))}
        </section>

        <aside className="lg:col-span-4 lg:sticky lg:top-24 self-start space-y-6">
          {/* AI Recommendation */}
          <div className="bg-surface text-surface-foreground rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="size-2 rounded-full bg-primary pulse-status" />
              <span className="text-[10px] font-mono uppercase tracking-widest opacity-70">
                AI Sommelier
              </span>
            </div>
            <p className="font-display italic text-xl leading-snug mb-3">
              "You've ordered pasta on your last 3 visits — try our Sea Bass tonight, then finish
              with the Molten Chocolate."
            </p>
            <p className="text-[11px] opacity-60">
              Personalized from your history · pairs with a glass of Pinot Grigio.
            </p>
          </div>

          {/* Cart */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest">Your Order</span>
              <span className="text-[10px] font-mono text-muted">Table 14</span>
            </div>
            {cartLines.length === 0 ? (
              <p className="text-sm text-muted italic py-6 text-center">
                Nothing added yet. Tap a dish to begin.
              </p>
            ) : (
              <div className="space-y-3">
                {cartLines.map((l) => (
                  <div key={l.id} className="flex justify-between text-sm">
                    <span>
                      <span className="font-mono text-primary mr-2">{l.qty}×</span>
                      {l.name}
                    </span>
                    <span className="font-mono">${(l.price * l.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t border-border pt-3 flex justify-between font-mono text-sm">
                  <span>Subtotal</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
                <button
                  onClick={place}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-full text-[11px] font-mono uppercase tracking-widest hover:opacity-90"
                >
                  Send to kitchen · Split & Pay
                </button>
              </div>
            )}
          </div>

          {/* Live status */}
          {placed && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="text-[10px] font-mono uppercase tracking-widest mb-3">
                Live Status
              </div>
              <ol className="space-y-3">
                {[
                  ["Placed", true],
                  ["Preparing", true],
                  ["Ready", false],
                  ["Served", false],
                ].map(([label, done]) => (
                  <li key={label as string} className="flex items-center gap-3 text-sm">
                    <span
                      className={
                        "size-2 rounded-full " + (done ? "bg-accent pulse-status" : "bg-border")
                      }
                    />
                    <span className={done ? "" : "text-muted"}>{label}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
