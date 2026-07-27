import { useState } from "react";
import { useInventory } from "../hooks/useInventory";
import { inventorySuggestReorder, type InventorySuggestion } from "@/features/ai/services/ai.service";
import { AlertTriangle, Clock, Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

function urgencyClass(u: string) {
  if (u === "Critical") return "bg-destructive/15 text-destructive border border-destructive/30";
  if (u === "High") return "bg-accent/15 text-accent border border-accent/30";
  if (u === "Medium") return "bg-primary/10 text-primary border border-primary/20";
  return "bg-white/5 text-muted border border-white/10";
}

export function InventoryTable() {
  const { inventory } = useInventory();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [suggestions, setSuggestions] = useState<Record<string, InventorySuggestion & { note?: string }>>({});

  async function generateSuggestion(itemId: string) {
    setLoading((prev) => ({ ...prev, [itemId]: true }));
    setExpanded(itemId);
    try {
      const res = await inventorySuggestReorder({ data: { itemId } });
      if (res && typeof res === "object" && "error" in res === false && "suggestedQty" in res) {
        setSuggestions((prev) => ({ ...prev, [itemId]: res as InventorySuggestion & { note?: string } }));
      }
    } finally {
      setLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border text-[10px] font-mono uppercase tracking-widest text-muted text-left">
        <span className="col-span-4">Item</span>
        <span className="col-span-2">On hand</span>
        <span className="col-span-2">Stock level</span>
        <span className="col-span-1">Reorder at</span>
        <span className="col-span-2 text-right">AI suggestion</span>
        <span className="col-span-1 text-right">Alert</span>
      </div>
      {inventory.map((i) => {
        const pct = Math.min(100, (i.qty / (i.reorderAt * 2)) * 100);
        const low = i.qty < i.reorderAt;
        const sug = suggestions[i.id];
        const isExpanded = expanded === i.id;
        const isLoading = !!loading[i.id];
        return (
          <div key={i.id} className="border-b border-border last:border-0">
            <div className="grid grid-cols-12 gap-4 px-5 py-4 items-center">
              <div className="col-span-4">
                <div className="font-medium">{i.name}</div>
                <div className="text-[10px] font-mono text-muted uppercase">{i.supplier}</div>
              </div>
              <span className="col-span-2 font-mono text-sm">
                {i.qty} {i.unit}
              </span>
              <div className="col-span-2">
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={"h-full " + (low ? "bg-destructive" : "bg-accent")}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
              <span className="col-span-1 font-mono text-[11px] text-muted">
                {i.reorderAt} {i.unit}
              </span>
              <div className="col-span-2 flex justify-end gap-2">
                <button
                  onClick={() => generateSuggestion(i.id)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded border border-primary/30 bg-primary/5 text-primary text-[10px] font-mono uppercase tracking-widest inline-flex items-center gap-1.5 hover:bg-primary/10 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : sug ? (
                    isExpanded ? (
                      <ChevronUp className="size-3" />
                    ) : (
                      <ChevronDown className="size-3" />
                    )
                  ) : (
                    <Sparkles className="size-3" />
                  )}
                  {sug ? (isExpanded ? "Hide" : "View") : "Generate"}
                </button>
              </div>
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
            {isExpanded && (
              <div className="px-5 pb-5">
                {isLoading ? (
                  <div className="bg-surface text-surface-foreground rounded-xl p-4 inline-flex items-center gap-2 text-sm">
                    <Loader2 className="size-4 animate-spin" />
                    Running AI procurement analysis for {i.name}…
                  </div>
                ) : sug ? (
                  <div className="bg-surface text-surface-foreground rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="size-4 text-primary" />
                        <span className="font-semibold">
                          AI suggested reorder for {sug.name}
                        </span>
                      </div>
                      <span className={"text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full " + urgencyClass(sug.urgency)}>
                        {sug.urgency} urgency
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
                      <div>
                        <div className="text-[9px] font-mono uppercase tracking-widest text-muted mb-1">
                          Suggested Qty
                        </div>
                        <div className="font-display italic text-xl text-primary">
                          {sug.suggestedQty} {sug.unit}
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] font-mono uppercase tracking-widest text-muted mb-1">
                          Supplier
                        </div>
                        <div className="text-sm">{sug.supplier}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-mono uppercase tracking-widest text-muted mb-1">
                          ETA
                        </div>
                        <div className="text-sm inline-flex items-center gap-1.5">
                          <Clock className="size-3.5 text-muted" /> {sug.etaDays} days
                        </div>
                      </div>
                      <div>
                        <div className="text-[9px] font-mono uppercase tracking-widest text-muted mb-1">
                          Risk
                        </div>
                        <div className="text-sm inline-flex items-center gap-1.5">
                          <AlertTriangle className="size-3.5 text-accent" />
                          {i.qty < i.reorderAt / 2 ? "Stock-out imminent" : "Plan by weekend"}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed border-t border-white/10 pt-3">
                      {sug.reason}
                      {sug.note ? (
                        <span className="text-primary/80 block mt-1 text-[11px] font-mono">
                          {sug.note}
                        </span>
                      ) : null}
                    </p>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
