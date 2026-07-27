import { supabase } from "@/lib/supabase";
import { type Order, type OrderStatus } from "../types/order.types";

export type RTEvent =
  | { type: "order:new"; order: Order }
  | { type: "order:status"; id: string; status: OrderStatus };

type Listener = (event: RTEvent) => void;
type OrderRow = {
  id: string;
  table_id: string;
  customer_id: string | null;
  items: Order["items"];
  status: OrderStatus;
  minutes: number;
  total: number | string;
};

const listeners = new Set<Listener>();
let browserChannel: BroadcastChannel | null = null;
let databaseChannelStarted = false;

function notify(event: RTEvent) {
  listeners.forEach((listener) => listener(event));
}

function asOrder(row: OrderRow): Order {
  return {
    id: row.id,
    table: row.table_id,
    customerId: row.customer_id ?? undefined,
    items: Array.isArray(row.items) ? row.items : [],
    status: row.status,
    minutes: Number(row.minutes) || 0,
    total: Number(row.total) || 0,
  };
}

function ensureBrowserChannel() {
  if (browserChannel || typeof window === "undefined" || typeof BroadcastChannel === "undefined") return;

  browserChannel = new BroadcastChannel("smartserve-rt");
  browserChannel.onmessage = (event) => notify(event.data as RTEvent);
}

function ensureDatabaseChannel() {
  if (databaseChannelStarted || typeof window === "undefined") return;
  databaseChannelStarted = true;

  supabase
    .channel("orders-realtime")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload) => {
      notify({ type: "order:new", order: asOrder(payload.new as OrderRow) });
    })
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders" }, (payload) => {
      const row = payload.new as OrderRow;
      notify({ type: "order:status", id: row.id, status: row.status });
    })
    .subscribe();
}

async function persist(event: RTEvent) {
  if (event.type === "order:new") {
    const { order } = event;
    const { error } = await supabase.from("orders").insert({
      id: order.id,
      table_id: order.table,
      customer_id: order.customerId,
      items: order.items,
      status: order.status,
      minutes: order.minutes,
      total: order.total,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
    return;
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: event.status, updated_at: new Date().toISOString() })
    .eq("id", event.id);
  if (error) throw error;
}

export async function loadOrders(): Promise<Order[]> {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data as OrderRow[]).map(asOrder);
}

export function publish(event: RTEvent) {
  ensureBrowserChannel();
  ensureDatabaseChannel();
  notify(event);
  browserChannel?.postMessage(event);
  void persist(event).catch((error) => console.error("Unable to persist order to Supabase", error));
}

export function subscribe(listener: Listener): () => void {
  ensureBrowserChannel();
  ensureDatabaseChannel();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useConnectionLabel() {
  return "realtime · live";
}
