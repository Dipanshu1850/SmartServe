import { useEffect, useMemo, useState } from "react";
import { useAnalytics } from "../hooks/useAnalytics";
import { RevenueChart } from "./RevenueChart";
import { PeakHoursChart } from "./PeakHoursChart";
import { ProactiveInsights } from "./ProactiveInsights";
import {
  computeDemandTiles,
  computeManagerKpis,
  computeSmartAlerts,
  computeTopItemsSorted,
} from "../lib/manager-metrics";
import { Clock, Package, UtensilsCrossed } from "lucide-react";

function KpiCard({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="text-[10px] font-mono uppercase tracking-widest text-muted">{label}</div>
      <div className="font-display italic text-3xl mt-2">{value}</div>
      {delta && <div className="text-[10px] font-mono text-accent mt-1">{delta}</div>}
    </div>
  );
}

function ForecastTile({
  label,
  value,
  delta,
  band,
  pct,
}: {
  label: string;
  value: string;
  delta: string;
  band: string;
  pct: number;
}) {
  const clamped = Math.max(6, Math.min(100, pct));
  return (
    <div className="bg-card border border-border rounded-2xl p-5 text-left">
      <div className="text-[9px] font-mono uppercase tracking-widest text-muted">{label}</div>
      <div className="font-display italic text-2xl mt-1">{value}</div>
      <div className="flex justify-between items-baseline mt-1">
        <span className="text-[10px] font-mono text-accent">{delta}</span>
        <span className="text-[9px] font-mono text-muted">{band}</span>
      </div>
      <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent via-primary to-primary/80"
          style={{ width: clamped + "%" }}
        />
      </div>
    </div>
  );
}

export function Overview() {
  const { salesByDay, hourly } = useAnalytics();
  const kpis = useMemo(() => computeManagerKpis(), []);
  const topItems = useMemo(() => computeTopItemsSorted(), []);
  const alerts = useMemo(() => computeSmartAlerts(), []);
  const forecastTiles = useMemo(() => computeDemandTiles(), []);
  const [maxSold, setMaxSold] = useState(1);
  useEffect(() => {
    setMaxSold(Math.max(1, ...topItems.map((t) => t.sold)));
  }, [topItems]);

  return (
    <div className="space-y-8 text-left">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Revenue today" value={kpis.revenueTodayFormatted} delta={kpis.revenueDelta} />
        <KpiCard label="Covers" value={String(kpis.coversToday)} delta={kpis.coversDelta} />
        <KpiCard label="Avg. ticket" value={kpis.avgTicketFormatted} />
        <KpiCard label="Turn time" value={kpis.turnTime} delta={kpis.turnDelta} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6">
          <div className="flex justify-between items-baseline mb-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted">
                Revenue · Last 7 days
              </div>
              <div className="font-display italic text-2xl mt-1">{kpis.revenueWeekFormatted}</div>
            </div>
            <span className="text-[10px] font-mono text-accent">{kpis.revWowDelta}</span>
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
                    style={{ width: `${(t.sold / maxSold) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-muted w-10 text-right">
                  {t.sold}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2 bg-surface text-surface-foreground rounded-2xl p-6">
          <div className="flex justify-between items-baseline mb-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-primary">
              Smart Alerts (Live)
            </div>
            <span className="text-[10px] font-mono text-muted/60">{alerts.length} active</span>
          </div>
          <ul className="space-y-3">
            {alerts.map((a) => {
              const Icon =
                a.icon === "stock" ? Package : a.icon === "slow" ? Clock : UtensilsCrossed;
              const toneClass =
                a.tone === "danger"
                  ? "border-destructive/30 text-destructive-foreground bg-destructive/10"
                  : a.tone === "warn"
                    ? "border-accent/20 bg-accent/5"
                    : "border-white/10 bg-white/5";
              const dotClass =
                a.tone === "danger"
                  ? "bg-destructive"
                  : a.tone === "warn"
                    ? "bg-accent"
                    : "bg-primary";
              return (
                <li
                  key={a.id}
                  className={"flex gap-3 items-start p-3 border rounded-lg " + toneClass}
                >
                  <Icon className="size-4 mt-0.5 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{a.title}</span>
                      <span className={"size-1.5 rounded-full pulse-status " + dotClass} />
                    </div>
                    <span className="text-xs text-muted-foreground">{a.message}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div>
        <div className="mb-4 flex justify-between items-baseline">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted">
              Predictive Analytics
            </span>
            <div className="font-display italic text-2xl mt-1">Demand Forecasting · Tonight</div>
          </div>
          <div className="text-[10px] font-mono text-muted/60">
            Confidence: 88% · Model: Ensemble
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {forecastTiles.map((f) => (
            <ForecastTile
              key={f.key}
              label={f.label}
              value={f.value}
              delta={f.delta}
              band={f.band}
              pct={f.pct}
            />
          ))}
        </div>
      </div>

      <ProactiveInsights />
    </div>
  );
}
