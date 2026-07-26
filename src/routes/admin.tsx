import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { RESTAURANTS } from "@/lib/mock-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Global Console · SmartServe Super Admin" },
      {
        name: "description",
        content: "Multi-tenant restaurant onboarding, occupancy, and fleet monitoring.",
      },
      { property: "og:title", content: "SmartServe Global Console" },
      {
        property: "og:description",
        content: "Onboard restaurants and monitor the whole fleet.",
      },
    ],
  }),
  component: () => (
    <RequireRole roles={["admin"]}>
      <Admin />
    </RequireRole>
  ),
});

const statusColor: Record<string, string> = {
  live: "text-accent",
  busy: "text-primary",
  idle: "opacity-40",
  off: "opacity-25",
};

function Admin() {
  const total = RESTAURANTS.reduce((s, r) => s + r.monthly, 0);
  const live = RESTAURANTS.filter((r) => r.status !== "off").length;

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <section className="bg-surface text-surface-foreground py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
            <div>
              <span className="font-mono text-[10px] text-primary tracking-[0.2em] uppercase mb-2 block">
                Global Console
              </span>
              <h1 className="text-5xl md:text-6xl font-display italic">Scaling flavor.</h1>
            </div>
            <button className="px-6 py-3 bg-primary text-primary-foreground font-mono text-[10px] uppercase tracking-widest rounded hover:opacity-90">
              + Onboard new restaurant
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              ["Restaurants", RESTAURANTS.length.toString()],
              ["Live now", live.toString()],
              ["MRR", `$${(total / 1000).toFixed(0)}k`],
              ["Avg. occupancy", "50%"],
            ].map(([k, v]) => (
              <div key={k} className="border border-white/10 rounded-xl p-5 bg-white/5">
                <div className="text-[10px] font-mono uppercase tracking-widest opacity-50 mb-2">
                  {k}
                </div>
                <div className="font-display italic text-3xl">{v}</div>
              </div>
            ))}
          </div>

          <div className="border border-white/10 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/10 text-[10px] font-mono uppercase tracking-widest opacity-50">
              <span className="col-span-4">Restaurant</span>
              <span className="col-span-3">City</span>
              <span className="col-span-2">Occupancy</span>
              <span className="col-span-2">Monthly</span>
              <span className="col-span-1 text-right">Status</span>
            </div>
            {RESTAURANTS.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-white/5 hover:bg-white/5 transition-colors items-center"
              >
                <div className="col-span-4">
                  <div className="font-display italic text-lg">{r.name}</div>
                </div>
                <span className="col-span-3 text-sm opacity-70">{r.city}</span>
                <div className="col-span-2">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${r.occupancy}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono opacity-60 mt-1 inline-block">
                    {r.occupancy}%
                  </span>
                </div>
                <span className="col-span-2 font-mono text-sm">
                  ${(r.monthly / 1000).toFixed(0)}k
                </span>
                <span
                  className={
                    "col-span-1 text-right text-[10px] font-mono uppercase tracking-widest " +
                    statusColor[r.status]
                  }
                >
                  ● {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
