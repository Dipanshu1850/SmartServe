import { SALES_BY_DAY, HOURLY, ORDERS, INVENTORY, RESERVATIONS, TABLES, TOP_ITEMS, type Order, type InventoryItem } from "@/lib/mock-data";

export function formatINR(n: number) {
  const [rupees, paisa] = Math.round(n * 100)
    .toString()
    .padStart(3, "0")
    .split(/(?=\d{3}$)/);
  return `INR ${rupees.replace(/\B(?=(\d{2})+(?!\d))/g, ",")}${paisa ? "." + paisa : ""}`;
}

export function computeManagerKpis() {
  const revenueToday = SALES_BY_DAY[SALES_BY_DAY.length - 1].revenue;
  const revenuePrev = SALES_BY_DAY[SALES_BY_DAY.length - 2]?.revenue ?? revenueToday;
  const coversToday = SALES_BY_DAY.reduce((s, d) => s + d.covers, 0);
  const ordersTotal = ORDERS.reduce((s, o) => s + o.total, 0);
  const ticketsCount = ORDERS.length;
  const avgTicket = ticketsCount ? Math.round(ordersTotal / ticketsCount) : 0;

  const totalMinutes = ORDERS.reduce((s, o) => s + (o.minutes ?? 0), 0);
  const turnTime = ticketsCount ? Math.max(8, Math.round(totalMinutes / ticketsCount) + 28) : 32;

  const revDelta = revenuePrev ? Math.round(((revenueToday - revenuePrev) / revenuePrev) * 100) : 0;
  const covDelta = 8;
  const ttDelta = -6;

  const reservationsToday = RESERVATIONS.length;
  const activeOrders = ORDERS.filter((o) => o.status !== "served").length;
  const occupiedTables = TABLES.filter((t) => t.status === "occupied").length;
  const totalTables = TABLES.length;
  const healthPct = Math.min(
    100,
    72 + Math.round(((SALES_BY_DAY[0]?.covers ?? 0) / 120) * 20),
  );
  const satScore = "4.8";
  const waitMin = 11;

  return {
    revenueToday,
    revenueTodayFormatted: formatINR(revenueToday),
    revenueDelta: (revDelta >= 0 ? "+ " : "− ") + Math.abs(revDelta) + "% vs last day",
    coversToday,
    coversDelta: (covDelta >= 0 ? "+ " : "− ") + Math.abs(covDelta) + "%",
    avgTicket,
    avgTicketFormatted: formatINR(avgTicket),
    turnTime: turnTime + "m",
    turnDelta: (ttDelta >= 0 ? "+ " : "− ") + Math.abs(ttDelta) + "m",
    revenueWeek: SALES_BY_DAY.reduce((s, d) => s + d.revenue, 0),
    revenueWeekFormatted: formatINR(SALES_BY_DAY.reduce((s, d) => s + d.revenue, 0)),
    revWowDelta: "+ 14% WoW",
    reservationsToday,
    activeOrders,
    occupiedTables,
    totalTables,
    healthPct,
    satScore,
    waitMin,
  };
}

export function computeTopItemsSorted() {
  return [...TOP_ITEMS].sort((a, b) => b.sold - a.sold);
}

export function computeSmartAlerts(): Array<{ id: string; icon: "wait" | "stock" | "slow"; title: string; message: string; tone: "warn" | "danger" | "info" }> {
  const alerts: Array<{ id: string; icon: "wait" | "stock" | "slow"; title: string; message: string; tone: "warn" | "danger" | "info" }> = [];

  const waiting = TABLES.find((t) => t.status === "occupied");
  if (waiting) {
    alerts.push({
      id: "table-" + waiting.id,
      icon: "wait",
      tone: "info",
      title: `Table ${waiting.id}`,
      message: `Occupied for ~12 min without order entry — consider checking in (${waiting.seats} seats).`,
    });
  }

  const critical: InventoryItem | undefined = INVENTORY.find((i) => i.qty < i.reorderAt);
  if (critical) {
    alerts.push({
      id: "inv-" + critical.id,
      icon: "stock",
      tone: "danger",
      title: `${critical.name} stock critical`,
      message: `${critical.qty} ${critical.unit} left (reorder at ${critical.reorderAt} ${critical.unit}). Auto-suggest 86 after ${Math.max(1, Math.floor(critical.qty * 2))} more line-items. Supplier ${critical.supplier}.`,
    });
  }

  const slowest: Order | undefined = [...ORDERS].sort((a, b) => (b.minutes ?? 0) - (a.minutes ?? 0))[0];
  if (slowest && (slowest.minutes ?? 0) > 2) {
    alerts.push({
      id: "ticket-" + slowest.id,
      icon: "slow",
      tone: "warn",
      title: `Ticket ${slowest.id}`,
      message: `Prep time ${slowest.minutes} min vs avg ~10 min. Table ${slowest.table}. Reassign to senior line cook if queue backs up.`,
    });
  }

  return alerts;
}

export function computeDemandTiles() {
  const covers = SALES_BY_DAY.reduce((s, d) => s + d.covers, 0);
  const revenue = SALES_BY_DAY.reduce((s, d) => s + d.revenue, 0);
  const peak = [...HOURLY].sort((a, b) => b.covers - a.covers)[0];
  const lowStock = INVENTORY.filter((i) => i.qty < i.reorderAt).length;
  const staffNeeded = covers > 400 ? "+2 floor" : "Baseline";
  const weekendLift = Math.round(SALES_BY_DAY.slice(-2).reduce((s, d) => s + d.revenue, 0) / 2000);

  return [
    { key: "revenue", label: "Revenue", value: formatINR(revenue).replace("INR ", "₹"), delta: "+ 12%", band: "On track", pct: 76 },
    { key: "covers", label: "Covers", value: String(covers), delta: "+ 8%", band: "Strong night", pct: 82 },
    { key: "peak", label: "Peak Hours", value: peak?.hr ?? "7p", delta: peak?.covers + " covers", band: "Queue expected", pct: 90 },
    { key: "inventory", label: "Inventory", value: String(lowStock) + " low", delta: String(INVENTORY.length) + " SKUs", band: lowStock ? "Restock soon" : "Healthy", pct: Math.max(25, 100 - lowStock * 18) },
    { key: "staff", label: "Staff", value: staffNeeded, delta: "On-shift 6", band: "Adequate", pct: 70 },
    { key: "weekend", label: "Weekend comp.", value: "+" + weekendLift + "%", delta: "MoM trend", band: weekendLift > 14 ? "Over target" : "On target", pct: Math.min(95, 55 + weekendLift) },
  ];
}

export function computeLifecycleEvents() {
  const orderEvents: Array<{ kind: "new_order" | "ready" | "table_ready" | "low_stock" | "reservation"; title: string; message: string; roles: Array<"customer" | "staff" | "manager" | "owner"> }> = [];

  for (const o of ORDERS.slice(0, 3)) {
    orderEvents.push({
      kind: "new_order",
      title: `New ticket ${o.id}`,
      message: `${o.items.length} line-items, table ${o.table}, total ${formatINR(o.total)}`,
      roles: ["manager", "staff"],
    });
  }

  const ready = ORDERS.find((o) => o.status === "preparing");
  if (ready) {
    orderEvents.push({
      kind: "ready",
      title: `Ticket ${ready.id} ready`,
      message: `Pick up station 1 · Table ${ready.table} · ${formatINR(ready.total)}`,
      roles: ["staff", "customer"],
    });
  }

  const freeTable = TABLES.find((t) => t.status === "free");
  if (freeTable) {
    orderEvents.push({
      kind: "table_ready",
      title: `Table ${freeTable.id} cleared`,
      message: "Turn complete — sanitized & re-seatable now.",
      roles: ["staff", "manager"],
    });
  }

  const low = INVENTORY.find((i) => i.qty < i.reorderAt);
  if (low) {
    orderEvents.push({
      kind: "low_stock",
      title: `${low.name} below reorder`,
      message: `${low.qty} ${low.unit} on hand. Supplier: ${low.supplier}.`,
      roles: ["manager", "owner"],
    });
  }

  const r0 = RESERVATIONS[0];
  if (r0) {
    orderEvents.push({
      kind: "reservation",
      title: `Reservation — ${r0.name}`,
      message: `${r0.party} guests @ ${r0.time}. Status ${r0.status}.`,
      roles: ["manager", "staff"],
    });
  }

  return orderEvents;
}
