import { useEffect, useMemo, useState } from "react";
import { type Ticket } from "../types/staff.types";
import { type OrderStatus } from "@/features/orders/types/order.types";
import { ORDERS } from "@/lib/mock-data";
import { loadOrders, subscribe, publish, useConnectionLabel } from "@/features/orders/services/order.service";

const NEXT: Record<OrderStatus, OrderStatus> = {
  queued: "preparing",
  preparing: "ready",
  ready: "served",
  served: "served",
};

export function useStaff() {
  const conn = useConnectionLabel();
  const [tickets, setTickets] = useState<Ticket[]>(() =>
    ORDERS.filter((o) => o.status !== "served").map((o) => ({
      ...o,
      openedAt: Date.now() - o.minutes * 60_000,
    })),
  );
  const [now, setNow] = useState(Date.now());
  const [showServed, setShowServed] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let mounted = true;
    void loadOrders()
      .then((orders) => {
        if (mounted && orders.length > 0) {
          setTickets(
            orders
              .filter((order) => order.status !== "served")
              .map((order) => ({ ...order, openedAt: Date.now() - order.minutes * 60_000 })),
          );
        }
      })
      .catch((error) => console.error("Unable to load kitchen orders from Supabase", error));

    const off = subscribe((e) => {
      if (e.type === "order:new") {
        setTickets((t) => {
          if (t.some((x) => x.id === e.order.id)) return t;
          return [{ ...e.order, openedAt: Date.now() }, ...t];
        });
      }
      if (e.type === "order:status") {
        setTickets((t) => t.map((x) => (x.id === e.id ? { ...x, status: e.status } : x)));
      }
    });
    return () => {
      mounted = false;
      off();
    };
  }, []);

  function bump(t: Ticket) {
    const next = NEXT[t.status];
    if (next === t.status) return;
    setTickets((list) => list.map((x) => (x.id === t.id ? { ...x, status: next } : x)));
    publish({ type: "order:status", id: t.id, status: next });
  }

  function recall(t: Ticket) {
    const order: OrderStatus[] = ["queued", "preparing", "ready", "served"];
    const prev = order[Math.max(0, order.indexOf(t.status) - 1)];
    setTickets((list) => list.map((x) => (x.id === t.id ? { ...x, status: prev } : x)));
    publish({ type: "order:status", id: t.id, status: prev });
  }

  const visible = useMemo(
    () => (showServed ? tickets : tickets.filter((t) => t.status !== "served")),
    [tickets, showServed],
  );

  const byStatus = useMemo(() => {
    return {
      queued: visible.filter((t) => t.status === "queued"),
      preparing: visible.filter((t) => t.status === "preparing"),
      ready: visible.filter((t) => t.status === "ready"),
    };
  }, [visible]);

  return {
    conn,
    tickets,
    now,
    showServed,
    setShowServed,
    bump,
    recall,
    visible,
    byStatus,
  };
}
