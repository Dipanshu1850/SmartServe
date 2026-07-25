// Mock realtime layer that emulates a WebSocket via BroadcastChannel + in-memory pubsub.
// Same-tab subscribers get instant delivery; cross-tab (QR page ↔ dashboard) works via BroadcastChannel.

import type { Order, OrderStatus } from "./mock-data";

export type RTEvent =
  | { type: "order:new"; order: Order }
  | { type: "order:status"; id: string; status: OrderStatus };

type Listener = (e: RTEvent) => void;

const listeners = new Set<Listener>();
let bc: BroadcastChannel | null = null;

function ensureChannel() {
  if (bc || typeof window === "undefined") return;
  if (typeof BroadcastChannel === "undefined") return;
  bc = new BroadcastChannel("smartserve-rt");
  bc.onmessage = (ev) => listeners.forEach((l) => l(ev.data as RTEvent));
}

export function publish(e: RTEvent) {
  ensureChannel();
  listeners.forEach((l) => l(e));
  bc?.postMessage(e);
}

export function subscribe(l: Listener): () => void {
  ensureChannel();
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

// Simulated "connection" status — always green for the demo, but exposed so UI can style it.
export function useConnectionLabel() {
  return "ws · live";
}
