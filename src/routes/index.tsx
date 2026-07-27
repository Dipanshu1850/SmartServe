import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import tagliatelle from "@/assets/dish-tagliatelle.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SmartServe — Operations plated with precision" },
      {
        name: "description",
        content:
          "The intelligent restaurant operating system. Live availability, smart queues, AI ops copilot — one engine, two faces.",
      },
      { property: "og:title", content: "SmartServe — Smart Restaurant OS" },
      {
        property: "og:description",
        content: "Bridge the kitchen line and the diner experience with live intelligence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <SiteNav />

      {/* Hero */}
      <section className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <div className="max-w-[85ch] animate-in">
          <h1 className="text-6xl md:text-8xl font-display text-balance leading-[0.9] mb-8 tracking-tighter">
            Operations <span className="italic text-primary">plated</span> with precision.
          </h1>
          <p className="text-xl text-muted max-w-[54ch] text-pretty leading-relaxed mb-10">
            SmartServe bridges the gap between the chaotic kitchen line and the curated customer
            experience. One engine, two faces, infinite control.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/customer"
              className="px-5 py-3 bg-foreground text-background rounded-full text-xs font-mono uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Try the Customer Experience →
            </Link>
            <Link
              to="/dashboard"
              className="px-5 py-3 border border-border rounded-full text-xs font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors"
            >
              Open Manager Dashboard
            </Link>
          </div>
        </div>

        {/* Differentiator strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 border-y border-border py-4 mt-16 animate-in">
          {[
            ["01", "Live Availability Sync"],
            ["02", "AI-Optimized Queueing"],
            ["03", "Margin Copilot Chat"],
          ].map(([n, label], i) => (
            <div
              key={n}
              className={
                "flex items-center gap-3 px-4 py-2 " +
                (i === 1 ? "border-x border-border" : "")
              }
            >
              <span className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                {n}
              </span>
              <span className="text-sm font-medium tracking-tight">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Split preview */}
      <section className="max-w-7xl mx-auto px-6 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-6 animate-in">
          <div className="flex items-end justify-between border-b border-border pb-2">
            <h3 className="font-display italic text-2xl">Customer Portal</h3>
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
              Table 14 · Scan active
            </span>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border space-y-6">
            <img
              src={tagliatelle}
              alt="Hand-cut tagliatelle"
              width={1024}
              height={768}
              loading="lazy"
              className="w-full aspect-[4/3] object-cover rounded-xl"
            />
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-semibold">Classic Butter Chicken</h4>
                  <p className="text-sm text-muted">
                    Tandoori chicken shreds, rich tomato-butter cream gravy, dry fenugreek.
                  </p>
                </div>
                <span className="font-mono text-primary">₹550.00</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-primary/5 border border-primary/20 rounded-full">
                  <span className="size-1.5 rounded-full bg-primary pulse-status" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">
                    8 Available
                  </span>
                </span>
                <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-accent/5 border border-accent/20 rounded-full">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-tighter">
                    AI Choice: Best with Pinot
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6 animate-in">
          <div className="flex items-end justify-between border-b border-border pb-2">
            <h3 className="font-display italic text-2xl">Staff Dashboard</h3>
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
              Active Shift: Dinner
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface text-surface-foreground rounded-2xl p-4 shadow-xl">
              <div className="flex justify-between mb-4 border-b border-white/10 pb-2">
                <span className="text-[10px] font-mono opacity-50">ORDERS KANBAN</span>
                <span className="text-[10px] font-mono">3 IN KITCHEN</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px] text-primary">#ORD-1042</span>
                    <span className="text-[10px] font-mono opacity-80">T-12 · 4m</span>
                  </div>
                  <p className="text-xs">2× Ribeye, 1× Sea Bass</p>
                </div>
                <div className="p-3 bg-white/10 border border-white/20 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px] text-primary">#ORD-1045</span>
                    <span className="text-[10px] font-mono opacity-80">T-04 · 1m</span>
                  </div>
                  <p className="text-xs">4× Amber Sour</p>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px] text-primary">#ORD-1046</span>
                    <span className="text-[10px] font-mono opacity-80">T-08 · 8m</span>
                  </div>
                  <p className="text-xs">2× Tagliatelle, 1× Burrata</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="size-2 rounded-full bg-accent pulse-status" />
                <span className="font-mono text-[10px] tracking-widest">OPS COPILOT</span>
              </div>
              <div className="flex-1 space-y-4">
                <div className="bg-secondary p-3 rounded-lg border border-border/50">
                  <p className="text-[11px] text-muted italic mb-2">
                    "What's our projected waste for tonight?"
                  </p>
                  <div className="flex items-end gap-1 h-12 mb-2">
                    {[40, 60, 90, 30, 50].map((h, i) => (
                      <div
                        key={i}
                        className={i === 2 ? "flex-1 bg-accent" : "flex-1 bg-accent/20"}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] font-medium leading-tight">
                    High chance of steak surplus. Recommend 'Chef's Choice' special for tables
                    8–12.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted">Type a query…</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono border border-border">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Super admin strip */}
      <section className="bg-surface text-surface-foreground py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
            <div>
              <span className="font-mono text-[10px] text-primary tracking-[0.2em] uppercase mb-2 block">
                Global Console
              </span>
              <h2 className="text-4xl font-display italic">Scaling flavor.</h2>
              <p className="mt-3 text-sm opacity-70 max-w-md">
                Multi-tenant from day one. Onboard a new restaurant in minutes and monitor the
                whole fleet from one pane of glass.
              </p>
            </div>
            <Link
              to="/admin"
              className="px-6 py-3 bg-primary text-primary-foreground font-mono text-[10px] uppercase tracking-widest rounded hover:opacity-90 transition-opacity"
            >
              Open Global Console →
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display italic text-lg">SmartServe</span>
        </div>
      </footer>
    </div>
  );
}
