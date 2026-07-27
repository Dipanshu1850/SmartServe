import { loadStored, saveStored } from "@/lib/browser-storage";

export type ReservationRecord = {
  id: string;
  mode: "reserve" | "queue";
  party: number;
  slot?: string;
  status: "confirmed" | "queued";
  createdAt: string;
};

const RESERVATIONS_KEY = "smartserve:customer-reservations";

export const ReservationService = {
  create(mode: ReservationRecord["mode"], party: number, slot?: string) {
    const reservation: ReservationRecord = {
      id: `RES-${Date.now().toString().slice(-6)}`,
      mode,
      party,
      slot,
      status: mode === "reserve" ? "confirmed" : "queued",
      createdAt: new Date().toISOString(),
    };
    const existing = loadStored<ReservationRecord[]>(RESERVATIONS_KEY, []);
    saveStored(RESERVATIONS_KEY, [reservation, ...existing]);
    return reservation;
  },

  getAll() {
    return loadStored<ReservationRecord[]>(RESERVATIONS_KEY, []);
  },

  getLiveQueue(party: number) {
    const latestQueued = this.getAll().find((reservation) => reservation.mode === "queue");
    return [
      { name: "Jae M.", party: 2, wait: 4 },
      { name: "Priya S.", party: 4, wait: 12 },
      { name: "You", party: latestQueued?.party ?? party, wait: (latestQueued?.party ?? party) <= 2 ? 6 : 18, self: true },
      { name: "Devon R.", party: 3, wait: 22 },
    ];
  }
};
