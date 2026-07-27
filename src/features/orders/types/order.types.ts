export type OrderStatus = "queued" | "preparing" | "ready" | "served";

export interface Order {
  id: string;
  table: string;
  customerId?: string;
  items: { name: string; qty: number }[];
  status: OrderStatus;
  minutes: number;
  total: number;
}

export type CheckoutItem = {
  name: string;
  qty: number;
  price: number;
};
