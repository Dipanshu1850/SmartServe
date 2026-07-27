import { type MenuItem } from "@/lib/mock-data";

export interface CustomerCart {
  [itemId: string]: number;
}

export type CustomerMenuItem = MenuItem;
