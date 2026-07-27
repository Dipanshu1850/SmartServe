import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";

interface PeakHoursChartProps {
  data: { hr: string; covers: number }[];
}

export function PeakHoursChart({ data }: PeakHoursChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 100% / 0.08)" />
        <XAxis
          dataKey="hr"
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
        <Line
          type="monotone"
          dataKey="covers"
          stroke="var(--color-accent)"
          strokeWidth={2.5}
          dot={{ r: 3 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
