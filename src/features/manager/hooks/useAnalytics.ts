import { SALES_BY_DAY, HOURLY, TOP_ITEMS } from "@/lib/mock-data";

export function useAnalytics() {
  return {
    salesByDay: SALES_BY_DAY,
    hourly: HOURLY,
    topItems: TOP_ITEMS,
  };
}
