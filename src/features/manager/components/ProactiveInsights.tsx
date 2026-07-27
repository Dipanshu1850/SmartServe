import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Sparkles, TrendingUp, AlertTriangle } from "lucide-react";

const INSIGHTS = [
  {
    title: "Demand Forecast",
    message: "Saturday 7-9 PM peak predicted at 112% capacity. Recommend +2 staff on floor.",
    icon: TrendingUp,
    type: "info",
  },
  {
    title: "Inventory Alert",
    message: "Wagyu Ribeye stock critical (0.4kg). Suggested reorder: 5kg from Supplier A.",
    icon: AlertTriangle,
    type: "warning",
  },
  {
    title: "Upsell Opportunity",
    message: "Red wine pairing with Butter Chicken has 85% success rate tonight. Brief servers.",
    icon: Sparkles,
    type: "success",
  },
];

export function ProactiveInsights() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const insight = INSIGHTS[index];
      const Icon = insight.icon;
      toast(insight.title, {
        description: insight.message,
        icon: <Icon className="size-4 text-primary" />,
        duration: 8000,
      });
      setIndex((prev) => (prev + 1) % INSIGHTS.length);
    }, 5000);

    return () => clearTimeout(timer);
  }, [index]);

  return null; // This is a background behavioral component
}
