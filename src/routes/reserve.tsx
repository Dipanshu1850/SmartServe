import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { toast } from "sonner";

export const Route = createFileRoute("/reserve")({
  head: () => ({
    meta: [
      { title: "Reserve or Join the Queue · SmartServe" },
      {
        name: "description",
        content:
          "Smart reservations and walk-in queue with live ETAs and auto table assignment.",
      },
      { property: "og:title", content: "Reserve · SmartServe" },
      {
        property: "og:description",
        content: "One intelligent waitlist for bookings and walk-ins.",
      },
    ],
  }),
  component: Reserve,
});

const SLOTS = ["6:00", "6:30", "7:00", "7:30", "8:00", "8:30", "9:00"];

function Reserve() {
  const [mode, setMode] = useState<"reserve" | "queue">("reserve");
  const [party, setParty] = useState(2);
  const [slot, setSlot] = useState("7:30");
  const [confirmed, setConfirmed] = useState(false);

  const queue = [
    { name: "Jae M.", party: 2, wait: 4 },
    { name: "Priya S.", party: 4, wait: 12 },
    { name: "You", party, wait: party <= 2 ? 6 : 18, self: true },
    { name: "Devon R.", party: 3, wait: 22 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <main className="max-w-5xl mx-auto px-6 py-16">
        <header className="border-b border-border pb-6 mb-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted">
            The Nook · Brooklyn
          </span>
          <h1 className="font-display text-5xl md:text-6xl italic mt-2">
            Reserve, or slip into the queue.
          </h1>
          <p className="text-muted mt-3 max-w-xl">
            Walk-ins and bookings share the same intelligent waitlist — we pair the next open
            table to the right party automatically.
          </p>
        </header>

        <div className="inline-flex p-1 bg-secondary rounded-full mb-10">
          {(["reserve", "queue"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m);
                setConfirmed(false);
              }}
              className={
                "px-5 py-2 rounded-full text-[11px] font-mono uppercase tracking-widest transition-colors " +
                (mode === m ? "bg-foreground text-background" : "text-muted")
              }
            >
              {m === "reserve" ? "Reserve a Table" : "Join the Queue"}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <section className="space-y-6">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted">
                Party size
              </label>
              <div className="flex gap-2 mt-2 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                  <button
                    key={n}
                    onClick={() => setParty(n)}
                    className={
                      "size-10 rounded-full font-mono text-sm border transition-colors " +
                      (n === party
                        ? "bg-foreground text-background border-foreground"
                        : "border-border hover:border-foreground")
                    }
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {mode === "reserve" && (
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-muted">
                  Tonight's slots
                </label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {SLOTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSlot(s)}
                      className={
                        "px-3 py-2 rounded font-mono text-xs border transition-colors " +
                        (s === slot
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border hover:border-foreground")
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setConfirmed(true);
                toast.success(
                  mode === "reserve"
                    ? `Reserved for ${party} @ ${slot}`
                    : `In queue · ETA ${party <= 2 ? 6 : 18} min`,
                );
              }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-[11px] font-mono uppercase tracking-widest hover:opacity-90"
            >
              {mode === "reserve" ? "Confirm reservation" : "Join queue"}
            </button>

            {confirmed && (
              <div className="bg-card border border-border rounded-2xl p-5 animate-in">
                <div className="text-[10px] font-mono uppercase tracking-widest text-accent mb-2">
                  ✓ Confirmed
                </div>
                <p className="font-display italic text-2xl">
                  {mode === "reserve"
                    ? `Table for ${party}, ${slot} PM.`
                    : `You're #3 in line — approx. ${party <= 2 ? 6 : 18} min.`}
                </p>
                <p className="text-xs text-muted mt-3">
                  We'll text you the moment your table is ready.
                </p>
              </div>
            )}
          </section>

          <aside className="bg-surface text-surface-foreground rounded-2xl p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest opacity-60">
                Live Queue
              </span>
              <span className="text-[10px] font-mono text-primary">4 waiting</span>
            </div>
            <ol className="space-y-3">
              {queue.map((q, i) => (
                <li
                  key={q.name}
                  className={
                    "flex items-center justify-between p-3 rounded-lg border " +
                    (q.self
                      ? "bg-primary/10 border-primary/30"
                      : "bg-white/5 border-white/10")
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] opacity-60 w-4">{i + 1}</span>
                    <div>
                      <div className="text-sm font-medium">{q.name}</div>
                      <div className="text-[10px] font-mono opacity-60 uppercase">
                        Party of {q.party}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-primary">~{q.wait}m</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </main>
    </div>
  );
}
