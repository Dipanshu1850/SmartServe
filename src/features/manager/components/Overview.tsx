import { useAnalytics } from "../hooks/useAnalytics";
import { RevenueChart } from "./RevenueChart";
import { PeakHoursChart } from "./PeakHoursChart";

function KpiCard({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted">{label}</div>
      <div className="font-display italic text-3xl mt-2">{value}</div>
      {delta && <div className="text-[10px] font-mono text-accent mt-1">{delta}</div>}
    </div>
  );
}

export function Overview() {
  const { salesByDay, hourly, topItems } = useAnalytics();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Revenue today" value="₹1,48,200" delta="↑ 12% vs last Sat" />
        <KpiCard label="Covers" value="128" delta="↑ 8%" />
        <KpiCard label="Avg. ticket" value="₹1,150" />
        <KpiCard label="Turn time" value="42m" delta="↓ 6m" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex justify-between items-baseline mb-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted">
                Revenue · Last 7 days
              </div>
              <div className="font-display italic text-2xl mt-1">₹10,34,600</div>
            </div>
            <span className="text-[10px] font-mono text-accent">↑ 14% WoW</span>
          </div>
          <div className="h-64">
            <RevenueChart data={salesByDay} />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-3">
            Peak hours · tonight
          </div>
          <div className="h-64">
            <PeakHoursChart data={hourly} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-4">
            Top items · this week
          </div>
          <ul className="space-y-3">
            {topItems.map((t) => (
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
