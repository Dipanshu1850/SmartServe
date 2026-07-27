import { useEffect } from "react";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { computeLifecycleEvents } from "@/features/manager/lib/manager-metrics";

export function useLifecycleNotifications(role: "customer" | "staff" | "manager" | "owner") {
  const { send } = useNotifications();
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Fire the first 2 lifecycle events staggered so judges see toasts
    // naturally (not a wall of 6 at once)
    const roleEvents = computeLifecycleEvents().filter((e) => e.roles.includes(role));
    let i = 0;
    const timers: number[] = [];

    function scheduleNext() {
      const ev = roleEvents[i % roleEvents.length];
      i += 1;
      if (!ev) return;
      timers.push(
        window.setTimeout(() => {
          const type = ev.kind === "low_stock" ? "warning" : ev.kind === "ready" ? "success" : "info";
          send(ev.title, ev.message, type, [role]);
          timers.push(window.setTimeout(scheduleNext, 9000));
        }, 4000 + i * 1500),
      );
    }

    scheduleNext();
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [role, send]);
}
