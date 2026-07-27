import { useOrders } from "@/features/orders/hooks/useOrders";
import { type OrderStatus } from "@/features/orders/types/order.types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  queued: "Queued",
  preparing: "Preparing",
  ready: "Ready",
  served: "Served",
};

export function OrdersKanban() {
  const { orders, advance } = useOrders();
  const cols: OrderStatus[] = ["queued", "preparing", "ready", "served"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cols.map((c) => {
        const list = orders.filter((o) => o.status === c);
        return (
          <div key={c} className="bg-card border border-border rounded-2xl p-4">
            <div className="flex justify-between items-center border-b border-border pb-2 mb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest">
                {STATUS_LABELS[c]}
              </span>
              <span className="text-[10px] font-mono text-muted">{list.length}</span>
            </div>
            <div className="space-y-2">
              {list.map((o) => (
                <button
                  key={o.id}
                  onClick={() => advance(o.id)}
                  className="w-full text-left p-3 bg-secondary hover:bg-primary/10 rounded-lg border border-border transition-colors"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px] text-primary">#{o.id}</span>
                    <span className="text-[10px] font-mono text-muted">
                      {o.table} · {o.minutes}m
                    </span>
                  </div>
                  <p className="text-xs">
                    {o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-muted">
                      ₹{o.total.toFixed(0)}
                    </span>
                    {c !== "served" && (
                      <span className="text-[10px] font-mono text-primary">Advance →</span>
                    )}
                  </div>
                </button>
              ))}
              {list.length === 0 && (
                <p className="text-xs text-muted italic text-center py-6">Empty</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
