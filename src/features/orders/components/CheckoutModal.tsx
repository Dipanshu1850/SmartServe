import { useState } from "react";
import { type CheckoutItem } from "../types/order.types";

export function CheckoutModal({
  open,
  onClose,
  items,
  tableLabel,
  onPaid,
}: {
  open: boolean;
  onClose: () => void;
  items: CheckoutItem[];
  tableLabel?: string;
  onPaid: (info: { total: number; tip: number; splits: number }) => void;
}) {
  const [tipPct, setTipPct] = useState<number>(20);
  const [splits, setSplits] = useState(1);
  const [step, setStep] = useState<"review" | "pay" | "done">("review");
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [processing, setProcessing] = useState(false);

  if (!open) return null;

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const tax = subtotal * 0.0875;
  const tip = (subtotal * tipPct) / 100;
  const total = subtotal + tax + tip;
  const perGuest = total / Math.max(1, splits);

  function pay() {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep("done");
      onPaid({ total, tip, splits });
    }, 1400);
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-surface/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md bg-card border border-border rounded-t-3xl sm:rounded-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-5 border-b border-border">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted">
              Checkout {tableLabel ? `· ${tableLabel}` : ""}
            </div>
            <div className="font-display italic text-2xl mt-1">
              {step === "done" ? "Thank you." : "Settle the bill."}
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full border border-border text-sm hover:bg-foreground/5"
          >
            ✕
          </button>
        </header>

        {step === "review" && (
          <div className="p-5 space-y-5">
            <ul className="space-y-2 text-sm max-h-40 overflow-y-auto">
              {items.map((it, i) => (
                <li key={i} className="flex justify-between border-b border-border py-1">
                  <span>
                    {it.name} <span className="text-muted font-mono">×{it.qty}</span>
                  </span>
                  <span className="font-mono">₹{(it.price * it.qty).toFixed(2)}</span>
                </li>
              ))}
            </ul>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-2">
                Tip
              </div>
              <div className="flex gap-2">
                {[15, 18, 20, 25].map((p) => (
                  <button
                    key={p}
                    onClick={() => setTipPct(p)}
                    className={
                      "flex-1 py-2 rounded-full text-xs font-mono " +
                      (tipPct === p
                        ? "bg-foreground text-background"
                        : "border border-border text-muted")
                    }
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted mb-2">
                Split evenly
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    onClick={() => setSplits(n)}
                    className={
                      "flex-1 py-2 rounded-full text-xs font-mono " +
                      (splits === n
                        ? "bg-foreground text-background"
                        : "border border-border text-muted")
                    }
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-background border border-border rounded-xl p-4 space-y-1 text-sm">
              <Row label="Subtotal" value={`₹${subtotal.toFixed(2)}`} />
              <Row label="Tax (8.75%)" value={`₹${tax.toFixed(2)}`} />
              <Row label={`Tip (${tipPct}%)`} value={`₹${tip.toFixed(2)}`} />
              <div className="border-t border-border pt-2 mt-2">
                <Row label="Total" value={`₹${total.toFixed(2)}`} bold />
                {splits > 1 && (
                  <Row
                    label={`Per guest (÷${splits})`}
                    value={`₹${perGuest.toFixed(2)}`}
                    muted
                  />
                )}
              </div>
            </div>

            <button
              onClick={() => setStep("pay")}
              className="w-full py-3 rounded-full bg-primary text-primary-foreground text-[11px] font-mono uppercase tracking-widest"
            >
              Continue to payment →
            </button>
          </div>
        )}

        {step === "pay" && (
          <div className="p-5 space-y-5">
            <div className="bg-background border border-border rounded-xl p-4">
              <div className="text-[10px] font-mono uppercase tracking-widest text-muted">
                Charge
              </div>
              <div className="font-display italic text-3xl">₹{total.toFixed(2)}</div>
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted">
                Card number
              </label>
              <input
                value={card}
                onChange={(e) => setCard(e.target.value)}
                className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 font-mono text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-muted">
                  Expiry
                </label>
                <input
                  defaultValue="12/28"
                  className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 font-mono text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-muted">
                  CVC
                </label>
                <input
                  defaultValue="123"
                  className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 font-mono text-sm"
                />
              </div>
            </div>
            <p className="text-[10px] font-mono text-muted">
              Demo mode · Stripe test card. No real charge.
            </p>
            <button
              onClick={pay}
              disabled={processing}
              className="w-full py-3 rounded-full bg-primary text-primary-foreground text-[11px] font-mono uppercase tracking-widest disabled:opacity-60"
            >
              {processing ? "Processing…" : `Pay ₹${total.toFixed(2)}`}
            </button>
          </div>
        )}

        {step === "done" && (
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto size-14 rounded-full bg-accent/20 border border-accent flex items-center justify-center text-accent text-2xl">
              ✓
            </div>
            <div>
              <div className="font-display italic text-3xl">Paid.</div>
              <p className="text-sm text-muted mt-2">
                ₹{total.toFixed(2)} charged · ₹{tip.toFixed(2)} tip added for the team.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full border border-border text-[11px] font-mono uppercase tracking-widest hover:bg-foreground/5"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold,
  muted,
}: {
  label: string;
  value: string;
  bold?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={
        "flex justify-between " +
        (bold ? "text-base font-medium " : "text-sm ") +
        (muted ? "text-muted" : "")
      }
    >
      <span>{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}
