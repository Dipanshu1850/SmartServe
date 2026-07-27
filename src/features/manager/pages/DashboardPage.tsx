import React, { useState, useEffect } from "react";
import { DashboardLayout } from "@/features/shared/components/DashboardLayout";
import { Overview } from "../components/Overview";
import { OrdersKanban } from "../components/OrdersKanban";
import { TablesMap } from "../components/TablesMap";
import { InventoryTable } from "../components/InventoryTable";
import { OpsCopilot } from "@/features/ai/components/OpsCopilot";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { useLifecycleNotifications } from "@/features/notifications/hooks/useLifecycleNotifications";
import { RevenueChart } from "../components/RevenueChart";
import { PeakHoursChart } from "../components/PeakHoursChart";
import { useAnalytics } from "../hooks/useAnalytics";
import { realtimeService } from "@/features/services/realtime.service";
import {
  TrendingUp,
  ClipboardList,
  Calendar,
  Package,
  Flame,
  Grid,
  Users,
  Smile,
  FileText,
  BarChart2,
  Sparkles,
  Bell,
  Settings as SettingsIcon,
} from "lucide-react";
import { toast } from "sonner";
import { downloadTextFile, loadStored, saveStored } from "@/lib/browser-storage";
import { SALES_BY_DAY, ORDERS, INVENTORY, TOP_ITEMS, HOURLY, TABLES } from "@/lib/mock-data";
import { computeManagerKpis } from "../lib/manager-metrics";

const TABS = [
  { id: "overview", label: "Business Overview", icon: TrendingUp },
  { id: "orders", label: "Orders", icon: ClipboardList },
  { id: "reservations", label: "Reservations", icon: Calendar },
  { id: "inventory", label: "Inventory", icon: Package },
  { id: "kitchen", label: "Kitchen", icon: Flame },
  { id: "tables", label: "Tables", icon: Grid },
  { id: "staff", label: "Staff Management", icon: Users },
  { id: "customers", label: "Customers", icon: Smile },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "copilot", label: "AI Operations Copilot", icon: Sparkles },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { salesByDay, hourly } = useAnalytics();
  useLifecycleNotifications("manager");

  // Real-time table listener
  const [tableAlerts, setTableAlerts] = useState<string[]>([]);
  useEffect(() => {
    return realtimeService.subscribe((eventType, data) => {
      if (eventType === "table:status") {
        const msg = `Table ${data.tableId} is now ${data.status}`;
        setTableAlerts((prev) => [msg, ...prev]);
        toast.info(msg);
      }
    });
  }, []);

  // Manager stats & roster lists
  const [staffRoster, setStaffRoster] = useState(() => loadStored("smartserve:manager-roster", [
    { name: "John D.", role: "Head Chef", status: "On Duty" },
    { name: "Sarah P.", role: "Server", status: "On Duty" },
    { name: "Liam K.", role: "Bartender", status: "Off Duty" },
    { name: "Sophia M.", role: "Hostess", status: "On Duty" },
  ]));

  const [loyaltyCustomers] = useState([
    { name: "Emily Johnson", visits: 24, spent: 8400, favorite: "Classic Butter Chicken" },
    { name: "Michael Chang", visits: 18, spent: 6100, favorite: "Mango Lassi" },
    { name: "David Miller", visits: 11, spent: 3900, favorite: "Tandoori Paneer Tikka" },
  ]);

  const [reservationList, setReservationList] = useState([
    { name: "Jae M.", party: 2, time: "6:30 PM", status: "Arrived" },
    { name: "Priya S.", party: 4, time: "7:00 PM", status: "Seated" },
    { name: "Mark G.", party: 5, time: "7:30 PM", status: "Pending" },
  ]);
  const [settings, setSettings] = useState(() =>
    loadStored("smartserve:manager-settings", { capacity: "85", dinnerStart: "5:00 PM" }),
  );

  function exportReport(title: string, description: string) {
    const kpis = computeManagerKpis();
    const csvCell = (v: string | number) => {
      const s = String(v ?? "");
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows: string[] = [];
    rows.push(["SmartServe Operations Report", title, new Date().toISOString()].map(csvCell).join(","));
    rows.push([description].map(csvCell).join(","));
    rows.push("");
    rows.push(["--- Shift KPI Summary ---"].map(csvCell).join(","));
    rows.push(["Metric", "Value", "Delta"].map(csvCell).join(","));
    rows.push(["Revenue Today", kpis.revenueTodayFormatted, kpis.revenueDelta].map(csvCell).join(","));
    rows.push(["Covers Today", String(kpis.coversToday), kpis.coversDelta].map(csvCell).join(","));
    rows.push(["Avg Ticket", kpis.avgTicketFormatted, ""].map(csvCell).join(","));
    rows.push(["Turn Time", kpis.turnTime, kpis.turnDelta].map(csvCell).join(","));
    rows.push(["Revenue Week", kpis.revenueWeekFormatted, kpis.revWowDelta].map(csvCell).join(","));
    rows.push(["Reservations Today", String(kpis.reservationsToday), ""].map(csvCell).join(","));
    rows.push(["Active Orders", String(kpis.activeOrders), ""].map(csvCell).join(","));
    rows.push(["Occupied Tables", `${kpis.occupiedTables}/${kpis.totalTables}`, ""].map(csvCell).join(","));
    rows.push("");
    rows.push(["--- Top Items Sold ---"].map(csvCell).join(","));
    rows.push(["Rank", "Item", "Qty Sold"].map(csvCell).join(","));
    [...TOP_ITEMS].sort((a, b) => b.sold - a.sold).forEach((t, i) => {
      rows.push([String(i + 1), t.name, String(t.sold)].map(csvCell).join(","));
    });
    rows.push("");
    rows.push(["--- Inventory Snapshot ---"].map(csvCell).join(","));
    rows.push(["SKU", "On Hand", "Unit", "Reorder At", "Supplier", "Status"].map(csvCell).join(","));
    INVENTORY.forEach((i) => {
      rows.push([i.name, String(i.qty), i.unit, String(i.reorderAt), i.supplier, i.qty < i.reorderAt ? "LOW" : "OK"].map(csvCell).join(","));
    });
    rows.push("");
    rows.push(["--- Active Orders ---"].map(csvCell).join(","));
    rows.push(["Order ID", "Table", "Status", "Min Elapsed", "Items", "Total (INR)"].map(csvCell).join(","));
    ORDERS.forEach((o) => {
      rows.push([
        o.id,
        o.table,
        o.status,
        String(o.minutes),
        String(o.items.reduce((s, it) => s + it.qty, 0)),
        String(o.total),
      ].map(csvCell).join(","));
    });
    rows.push("");
    rows.push(["--- Weekly Sales ---"].map(csvCell).join(","));
    rows.push(["Day", "Revenue (INR)", "Covers"].map(csvCell).join(","));
    SALES_BY_DAY.forEach((d) => rows.push([d.day, String(d.revenue), String(d.covers)].map(csvCell).join(",")));
    rows.push("");
    rows.push(["--- Table Status Summary ---"].map(csvCell).join(","));
    rows.push(["Table", "Seats", "Status"].map(csvCell).join(","));
    TABLES.forEach((t) => rows.push([t.id, String(t.seats), t.status].map(csvCell).join(",")));
    downloadTextFile(
      `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`,
      rows.join("\n") + "\n",
      "text/csv;charset=utf-8",
    );
    toast.success("Report downloaded — " + ORDERS.length + " orders, " + INVENTORY.length + " SKUs");
  }

  function saveSettings() {
    saveStored("smartserve:manager-settings", settings);
    toast.success("Settings saved");
  }

  function changeRosterStatus(name: string, nextStatus: string) {
    const next = staffRoster.map((s) => (s.name === name ? { ...s, status: nextStatus } : s));
    setStaffRoster(next);
    saveStored("smartserve:manager-roster", next);
    toast.success(`${name} status updated to ${nextStatus}`);
  }

  // Central notifications
  const { notifications, markAsRead } = useNotifications();

  return (
    <DashboardLayout
      role="manager"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={TABS}
    >
      {/* 1. BUSINESS OVERVIEW */}
      {activeTab === "overview" && <Overview />}

      {/* 2. ORDERS */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <h2 className="font-display text-3xl italic text-white text-left">Live Order Grid</h2>
          <OrdersKanban />
        </div>
      )}

      {/* 3. RESERVATIONS */}
      {activeTab === "reservations" && (
        <div className="space-y-6">
          <h2 className="font-display text-3xl italic text-white text-left">Reservations Console</h2>
          <div className="bg-[#121214] border border-[#1e1e24] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#1e1e24] text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa] text-left">
              <span className="col-span-3">Guest</span>
              <span className="col-span-2">Party</span>
              <span className="col-span-3">Time</span>
              <span className="col-span-4 text-right">Status</span>
            </div>
            {reservationList.map((r, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-[#1e1e24]/50 items-center text-left"
              >
                <span className="col-span-3 font-semibold text-white">{r.name}</span>
                <span className="col-span-2 font-mono text-xs text-muted-foreground">{r.party} Guests</span>
                <span className="col-span-3 font-mono text-xs text-muted-foreground">{r.time}</span>
                <div className="col-span-4 text-right">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 bg-white/5 border border-white/10 rounded text-white">
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. INVENTORY */}
      {activeTab === "inventory" && (
        <div className="space-y-6">
          <h2 className="font-display text-3xl italic text-white text-left">Stock Audit</h2>
          <InventoryTable />
        </div>
      )}

      {/* 5. KITCHEN */}
      {activeTab === "kitchen" && (
        <div className="space-y-6">
          <h2 className="font-display text-3xl italic text-white text-left">Kitchen Throughput</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              ["Tickets Completed Today", "124", "Target: 150"],
              ["Average Preparation Time", "14.2m", "Target: 15m"],
              ["Dishes 86'd", "0", "Ribeye restocked"],
            ].map(([k, v, s]) => (
              <div key={k} className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-5 text-left">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#a1a1aa]">{k}</span>
                <div className="font-display italic text-3xl text-white mt-2">{v}</div>
                <span className="text-[10px] text-muted-foreground mt-1 block">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. TABLES */}
      {activeTab === "tables" && <TablesMap />}

      {/* 7. STAFF MANAGEMENT */}
      {activeTab === "staff" && (
        <div className="space-y-6">
          <h2 className="font-display text-3xl italic text-white text-left">Staff duty roster</h2>
          <div className="bg-[#121214] border border-[#1e1e24] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#1e1e24] text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa] text-left">
              <span className="col-span-4">Staff Member</span>
              <span className="col-span-4">Role</span>
              <span className="col-span-4 text-right">Roster Status</span>
            </div>
            {staffRoster.map((s, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-[#1e1e24]/50 items-center text-left"
              >
                <span className="col-span-4 font-semibold text-white">{s.name}</span>
                <span className="col-span-4 font-mono text-xs text-primary">{s.role}</span>
                <div className="col-span-4 text-right">
                  <button
                    onClick={() => changeRosterStatus(s.name, s.status === "On Duty" ? "Off Duty" : "On Duty")}
                    className={
                      "px-3 py-1 rounded font-mono text-[9px] uppercase border cursor-pointer " +
                      (s.status === "On Duty" ? "bg-accent border-accent text-accent-foreground" : "border-[#1e1e24] text-muted")
                    }
                  >
                    {s.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. CUSTOMERS */}
      {activeTab === "customers" && (
        <div className="space-y-6">
          <h2 className="font-display text-3xl italic text-white text-left">Loyalty & Guests</h2>
          <div className="bg-[#121214] border border-[#1e1e24] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#1e1e24] text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa] text-left">
              <span className="col-span-3">Customer</span>
              <span className="col-span-3">Visits Count</span>
              <span className="col-span-3">Total Spend</span>
              <span className="col-span-3 text-right">Favorite Dish</span>
            </div>
            {loyaltyCustomers.map((c, i) => (
              <div
                key={i}
                className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-[#1e1e24]/50 items-center text-left"
              >
                <span className="col-span-3 font-semibold text-white">{c.name}</span>
                <span className="col-span-3 font-mono text-xs text-muted-foreground">{c.visits} shifts</span>
                <span className="col-span-3 font-mono text-xs text-primary">₹{c.spent}</span>
                <span className="col-span-3 text-right font-mono text-xs text-muted-foreground">{c.favorite}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. REPORTS */}
      {activeTab === "reports" && (
        <div className="space-y-6">
          <h2 className="font-display text-3xl italic text-white text-left">Operations Logs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ["Sales Summary Report - Weekly", "Export summary of billing receipts & covers."],
              ["Kitchen Waste Log - Daily", "Track ingredient dump counts & scrap values."],
              ["Audit Log - Login Trials", "Access logins audit trails for compliance check."]
            ].map(([title, desc], i) => (
              <div
                key={i}
                className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-5 flex justify-between items-center text-left"
              >
                <div>
                  <h4 className="text-sm font-semibold text-white">{title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                </div>
                <button
                  onClick={() => exportReport(title, desc)}
                  className="px-4 py-2 bg-white text-black text-[10px] font-mono uppercase tracking-widest rounded-full cursor-pointer"
                >
                  Export
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="space-y-8">
          <h2 className="font-display text-3xl italic text-white text-left">Shift Metrics</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart data={salesByDay} />
            <PeakHoursChart data={hourly} />
          </div>
        </div>
      )}

      {/* 11. COPILOT */}
      {activeTab === "copilot" && (
        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa]">
              Operations advisor
            </span>
            <h2 className="font-display text-3xl italic text-white mt-1">Ops Copilot.</h2>
          </div>
          <OpsCopilot />
        </div>
      )}

      {/* 12. NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="font-display text-3xl italic text-white mb-6">Manager Alerts</h2>
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={
                "p-4 rounded-xl border flex items-start gap-4 transition-colors cursor-pointer " +
                (n.read ? "bg-[#121214]/50 border-[#1e1e24]/70 opacity-60" : "bg-[#181822]/80 border-primary/20")
              }
            >
              <span className="size-2 rounded-full bg-primary mt-2" />
              <div className="flex-1 text-left">
                <h4 className="text-sm font-semibold text-white">{n.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                <span className="text-[9px] font-mono text-muted/40 block mt-2">
                  {new Date(n.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 13. SETTINGS */}
      {activeTab === "settings" && (
        <div className="max-w-md mx-auto">
          <div className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-6 text-left space-y-4">
            <h3 className="font-display italic text-2xl text-white">Shift Configs</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-mono uppercase text-muted-foreground block">
                  Capacity limit (covers)
                </label>
                <input
                  type="number"
                  value={settings.capacity}
                  onChange={(event) => setSettings((current) => ({ ...current, capacity: event.target.value }))}
                  className="mt-1 w-full bg-background border border-[#1e1e24] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[9px] font-mono uppercase text-muted-foreground block">
                  Dinner start hour
                </label>
                <input
                  type="text"
                  value={settings.dinnerStart}
                  onChange={(event) => setSettings((current) => ({ ...current, dinnerStart: event.target.value }))}
                  className="mt-1 w-full bg-background border border-[#1e1e24] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>
              <button
                onClick={saveSettings}
                className="w-full py-3 bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-widest rounded-full hover:opacity-90 cursor-pointer"
              >
                Save configurations
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default DashboardPage;
