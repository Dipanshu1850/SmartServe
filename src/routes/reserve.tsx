import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { ReserveForm } from "@/features/reservations/components/ReserveForm";
import { ReservationList } from "@/features/reservations/components/ReservationList";
import { ReservationService } from "@/features/reservations/services/reservation.service";

export const Route = createFileRoute("/reserve")({
  head: () => ({
    meta: [
      { title: "Reserve or Join the Queue · SmartServe" },
      {
        name: "description",
        content:
          "Smart reservations and walk-in queue with live ETAs and auto table assignment.",
      },
      { property: "og:title", content: "Reserve · SmartServe" },
      {
        property: "og:description",
        content: "One intelligent waitlist for bookings and walk-ins.",
      },
    ],
  }),
  component: ReserveRouteComponent,
});

function ReserveRouteComponent() {
  const [mode, setMode] = useState<"reserve" | "queue">("reserve");
  const [party, setParty] = useState(2);
  const [confirmed, setConfirmed] = useState(false);

  const queue = ReservationService.getLiveQueue(party);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <main className="max-w-5xl mx-auto px-6 py-16">
        <header className="border-b border-border pb-6 mb-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted">
            The Nook · Brooklyn
          </span>
          <h1 className="font-display text-5xl md:text-6xl italic mt-2">
            Reserve, or slip into the queue.
          </h1>
          <p className="text-muted mt-3 max-w-xl">
            Walk-ins and bookings share the same intelligent waitlist — we pair the next open
            table to the right party automatically.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <ReserveForm
            mode={mode}
            setMode={setMode}
            party={party}
            setParty={setParty}
            confirmed={confirmed}
            setConfirmed={setConfirmed}
          />
          <ReservationList queue={queue} />
        </div>
      </main>
    </div>
  );
}
