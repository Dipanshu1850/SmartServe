import { useState, useEffect } from "react";
import { type Order, type OrderStatus } from "../types/order.types";
import { loadOrders, subscribe, publish } from "../services/order.service";
import { ORDERS } from "@/lib/mock-data";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(ORDERS);

  useEffect(() => {
    let mounted = true;
    void loadOrders()
      .then((storedOrders) => {
        if (mounted && storedOrders.length > 0) setOrders(storedOrders);
      })
      .catch((error) => console.error("Unable to load orders from Supabase", error));

    const off = subscribe((e) => {
      if (e.type === "order:new") {
        setOrders((os) => (os.some((o) => o.id === e.order.id) ? os : [e.order, ...os]));
      } else if (e.type === "order:status") {
        setOrders((os) => os.map((o) => (o.id === e.id ? { ...o, status: e.status } : o)));
      }
    });
    return () => {
      mounted = false;
      off();
    };
  }, []);

  function advance(id: string) {
    const next: Record<OrderStatus, OrderStatus> = {
      queued: "preparing",
      preparing: "ready",
      ready: "served",
      served: "served",
    };

    const target = orders.find((o) => o.id === id);
    if (!target) return;
    const newStatus = next[target.status];
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
    publish({ type: "order:status", id, status: newStatus });
  }

  return {
    orders,
    setOrders,
    advance,
  };
}
