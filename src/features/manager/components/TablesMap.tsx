import { QRCodeSVG } from "qrcode.react";
import { TABLES } from "@/lib/mock-data";

const tableColor: Record<string, string> = {
  free: "bg-accent/20 border-accent/40 text-accent",
  occupied: "bg-primary/20 border-primary/40 text-primary",
  reserved: "bg-foreground/10 border-foreground/30 text-foreground",
  cleaning: "bg-muted/10 border-border text-muted",
};

export function TablesMap() {
  return (
    <div className="space-y-6">
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

      <QRCodeSection />
    </div>
  );
}

function QRCodeSection() {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <div className="flex items-end justify-between mb-4">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted">
            Table QR Codes · Scan-to-Order
          </div>
          <p className="font-display italic text-xl mt-1">
            Print, place, pour. Guests order in seconds.
          </p>
        </div>
        <span className="hidden sm:inline text-[10px] font-mono uppercase tracking-widest text-muted">
          Live-linked to kitchen via WebSocket
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {TABLES.slice(0, 10).map((t) => {
          const url = `${origin}/t/${t.id}`;
          return (
            <a
              key={t.id}
              href={`/t/${t.id}`}
              target="_blank"
              rel="noreferrer"
              className="group bg-background border border-border rounded-xl p-3 flex flex-col items-center gap-2 hover:border-primary transition-colors"
            >
              <div className="bg-white p-2 rounded-lg">
                <QRCodeSVG value={url} size={96} level="M" />
              </div>
              <div className="text-center">
                <div className="font-mono text-[11px] font-bold">{t.id}</div>
                <div className="text-[9px] font-mono uppercase tracking-widest text-muted group-hover:text-primary">
                  Open menu →
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
