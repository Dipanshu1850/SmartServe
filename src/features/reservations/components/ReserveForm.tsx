import { useState } from "react";
import { toast } from "sonner";
import { ReservationService } from "../services/reservation.service";

const SLOTS = ["6:00", "6:30", "7:00", "7:30", "8:00", "8:30", "9:00"];

interface ReserveFormProps {
  mode: "reserve" | "queue";
  setMode: (m: "reserve" | "queue") => void;
  party: number;
  setParty: (p: number) => void;
  confirmed: boolean;
  setConfirmed: (c: boolean) => void;
}

export function ReserveForm({
  mode,
  setMode,
  party,
  setParty,
  confirmed,
  setConfirmed,
}: ReserveFormProps) {
  const [slot, setSlot] = useState("7:30");

  return (
    <div className="space-y-6">
      <div className="inline-flex p-1 bg-secondary rounded-full mb-4">
        {(["reserve", "queue"] as const).map((m) => (
          <button
            key={m}
            onClick={() => {
              setMode(m);
              setConfirmed(false);
            }}
            className={
              "px-5 py-2 rounded-full text-[11px] font-mono uppercase tracking-widest transition-colors " +
              (mode === m ? "bg-foreground text-background" : "text-muted")
            }
          >
            {m === "reserve" ? "Reserve a Table" : "Join the Queue"}
          </button>
        ))}
      </div>

      <div>
        <label className="text-[10px] font-mono uppercase tracking-widest text-muted">
          Party size
        </label>
        <div className="flex gap-2 mt-2 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 8].map((n) => (
            <button
              key={n}
              onClick={() => setParty(n)}
              className={
                "size-10 rounded-full font-mono text-sm border transition-colors " +
                (n === party
                  ? "bg-foreground text-background border-foreground"
                  : "border-border hover:border-foreground")
              }
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {mode === "reserve" && (
        <div>
          <label className="text-[10px] font-mono uppercase tracking-widest text-muted">
            Tonight's slots
          </label>
          <div className="flex gap-2 mt-2 flex-wrap">
            {SLOTS.map((s) => (
              <button
                key={s}
                onClick={() => setSlot(s)}
                className={
                  "px-3 py-2 rounded font-mono text-xs border transition-colors " +
                  (s === slot
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-foreground")
                }
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => {
          ReservationService.create(mode, party, mode === "reserve" ? slot : undefined);
          setConfirmed(true);
          toast.success(
            mode === "reserve"
              ? `Reserved for ${party} @ ${slot}`
              : `In queue · ETA ${party <= 2 ? 6 : 18} min`,
          );
        }}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-full text-[11px] font-mono uppercase tracking-widest hover:opacity-90 block"
      >
        {mode === "reserve" ? "Confirm reservation" : "Join queue"}
      </button>

      {confirmed && (
        <div className="bg-card border border-border rounded-2xl p-5 animate-in">
          <div className="text-[10px] font-mono uppercase tracking-widest text-accent mb-2">
            ✓ Confirmed
          </div>
          <p className="font-display italic text-2xl">
            {mode === "reserve"
              ? `Table for ${party}, ${slot} PM.`
              : `You're #3 in line — approx. ${party <= 2 ? 6 : 18} min.`}
          </p>
          <p className="text-xs text-muted mt-3">
            We'll text you the moment your table is ready.
          </p>
        </div>
      )}
    </div>
  );
}
