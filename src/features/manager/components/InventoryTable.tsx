import { useInventory } from "../hooks/useInventory";

export function InventoryTable() {
  const { inventory } = useInventory();

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border text-[10px] font-mono uppercase tracking-widest text-muted">
        <span className="col-span-4">Item</span>
        <span className="col-span-2">On hand</span>
        <span className="col-span-3">Stock level</span>
        <span className="col-span-2">Reorder at</span>
        <span className="col-span-1 text-right">Alert</span>
      </div>
      {inventory.map((i) => {
        const pct = Math.min(100, (i.qty / (i.reorderAt * 2)) * 100);
        const low = i.qty < i.reorderAt;
        return (
          <div
            key={i.id}
            className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-border items-center"
          >
            <div className="col-span-4">
              <div className="font-medium">{i.name}</div>
              <div className="text-[10px] font-mono text-muted uppercase">{i.supplier}</div>
            </div>
            <span className="col-span-2 font-mono text-sm">
              {i.qty} {i.unit}
            </span>
            <div className="col-span-3">
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={"h-full " + (low ? "bg-destructive" : "bg-accent")}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
            <span className="col-span-2 font-mono text-[11px] text-muted">
              {i.reorderAt} {i.unit}
            </span>
            <span className="col-span-1 text-right">
              {low ? (
                <span className="text-[10px] font-mono text-destructive uppercase tracking-widest">
                  ● Low
                </span>
              ) : (
                <span className="text-[10px] font-mono text-accent uppercase tracking-widest">
                  ● OK
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}
