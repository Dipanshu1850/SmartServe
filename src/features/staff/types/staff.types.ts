import { type Order } from "@/features/orders/types/order.types";

export type Ticket = Order & { openedAt: number };
