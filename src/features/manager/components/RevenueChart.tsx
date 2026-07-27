import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

interface RevenueChartProps {
  data: { day: string; revenue: number; covers: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 100% / 0.08)" />
        <XAxis
          dataKey="day"
          tick={{ fill: "var(--color-surface-foreground)", fontSize: 11 }}
          axisLine={{ stroke: "var(--color-surface-foreground)", opacity: 0.25 }}
          tickLine={{ stroke: "var(--color-surface-foreground)", opacity: 0.25 }}
        />
        <YAxis
          tick={{ fill: "var(--color-surface-foreground)", fontSize: 11 }}
          axisLine={{ stroke: "var(--color-surface-foreground)", opacity: 0.25 }}
          tickLine={{ stroke: "var(--color-surface-foreground)", opacity: 0.25 }}
        />
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
  );
}
