import { useEffect, useState, useMemo } from "react";
import { MENU, type MenuItem } from "@/lib/mock-data";
import { toast } from "sonner";
import { publish, subscribe } from "@/features/orders/services/order.service";
import { type Order } from "@/features/orders/types/order.types";

export const CATEGORIES = ["Starters", "Mains", "Desserts", "Drinks"] as const;
const ACTIVE_ORDER_STORAGE_KEY = "smartserve:active-order";

function getStoredActiveOrders(): Order[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = JSON.parse(window.localStorage.getItem(ACTIVE_ORDER_STORAGE_KEY) ?? "[]") as Order | Order[];
    // Accept the former single-order storage shape so existing active orders
    // survive this update as well.
    const orders = Array.isArray(stored) ? stored : stored?.id ? [stored] : [];
    return orders.filter((order) => order?.id && order.status !== "served");
  } catch {
    return [];
  }
}

export function useCustomer() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Mains");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [activeOrders, setActiveOrders] = useState<Order[]>(getStoredActiveOrders);

  const items = useMemo(() => MENU.filter((m) => m.category === category), [category]);

  const cartLines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => {
          const m = MENU.find((x) => x.id === id);
          return m ? { ...m, qty } : null;
        })
        .filter(Boolean) as (MenuItem & { qty: number })[],
    [cart],
  );

  const total = cartLines.reduce((s, l) => s + l.price * l.qty, 0);

  useEffect(() => {
    return subscribe((event) => {
      if (event.type !== "order:status") return;
      setActiveOrders((orders) =>
        event.status === "served"
          ? orders.filter((order) => order.id !== event.id)
          : orders.map((order) => (order.id === event.id ? { ...order, status: event.status } : order)),
      );
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (activeOrders.length > 0) {
      window.localStorage.setItem(ACTIVE_ORDER_STORAGE_KEY, JSON.stringify(activeOrders));
    } else {
      window.localStorage.removeItem(ACTIVE_ORDER_STORAGE_KEY);
    }
  }, [activeOrders]);

  function add(item: MenuItem) {
    if (item.available === 0) return;
    setCart((c) => ({ ...c, [item.id]: (c[item.id] ?? 0) + 1 }));
    toast(`Added ${item.name}`, { description: `₹${item.price.toFixed(2)}` });
  }

  function place() {
    if (cartLines.length === 0) return;
    if (!user) {
      toast.error("Please sign in before placing an order.");
      return;
    }
    const order: Order = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      table: "T-15",
      customerId: user.id,
      items: cartLines.map((item) => ({ name: item.name, qty: item.qty })),
      status: "queued",
      minutes: 0,
      total,
    };

    setActiveOrders((orders) => [order, ...orders]);
    setCart({});
    publish({ type: "order:new", order });
    toast.success("Order sent to kitchen", { description: `${order.id} is now in live tracking.` });
  }

  return {
    category,
    setCategory,
    cart,
    setCart,
    placed: activeOrders.length > 0,
    activeOrders,
    items,
    cartLines,
    total,
    add,
    place,
  };
}
