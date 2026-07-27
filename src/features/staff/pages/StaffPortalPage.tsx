import React, { useState, useEffect, useMemo } from "react";
import { SiteNav } from "@/components/SiteNav";
import { DashboardLayout } from "@/features/shared/components/DashboardLayout";
import { useStaff } from "../hooks/useStaff";
import { Column as KanbanColumn } from "../components/Column";
import { TicketCard } from "../components/TicketCard";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { useLifecycleNotifications } from "@/features/notifications/hooks/useLifecycleNotifications";
import { realtimeService } from "@/features/services/realtime.service";
import { TABLES, type Table } from "@/lib/mock-data";
import {
  ClipboardList,
  Columns,
  Grid,
  Calendar,
  CheckSquare,
  Zap,
  MapPin,
  Bell,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { loadStored, saveStored } from "@/lib/browser-storage";

const TABS = [
  { id: "orders", label: "Today's Orders", icon: ClipboardList },
  { id: "kitchen", label: "Kitchen Queue", icon: Columns },
  { id: "assigned", label: "Assigned Tables", icon: Grid },
  { id: "reservations", label: "Reservations", icon: Calendar },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "requests", label: "Customer Requests", icon: Zap },
  { id: "tables", label: "Table Status", icon: MapPin },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile", label: "Profile", icon: UserIcon },
];

export function StaffPortalPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("kitchen");
  useLifecycleNotifications("staff");

  // Staff hooks state
  const {
    conn,
    now,
    showServed,
    setShowServed,
    bump,
    recall,
    tickets,
    byStatus,
  } = useStaff();

  // Reservations state
  const [reservations, setReservations] = useState(() => loadStored("smartserve:staff-reservations", [
    { id: "1", name: "Jae M.", party: 2, time: "6:30 PM", status: "Arrived" },
    { id: "2", name: "Priya S.", party: 4, time: "7:00 PM", status: "Seated" },
    { id: "3", name: "Mark G.", party: 5, time: "7:30 PM", status: "Pending" },
    { id: "4", name: "Devon R.", party: 3, time: "8:00 PM", status: "Pending" },
  ]));
  function checkInRes(id: string, status: string) {
    setReservations(reservations.map((r) => (r.id === id ? { ...r, status } : r)));
    toast.success(`Reservation updated to ${status}`);
    realtimeService.publish("reservation:update", { id, status });
  }

  // Tasks state
  const [tasks, setTasks] = useState(() => loadStored("smartserve:staff-tasks", [
    { id: "1", text: "Polish wine glasses at station 2", done: false },
    { id: "2", text: "Restock side station bread plates", done: true },
    { id: "3", text: "Sanitize menu covers for dinner", done: false },
    { id: "4", text: "Check patio heater gas levels", done: false },
  ]));
  function toggleTask(id: string) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    toast.success("Task checklist updated");
  }

  // Live customer requests state
  const [requests, setRequests] = useState(() => loadStored("smartserve:staff-requests", [
    { id: "1", table: "T-04", message: "Needs water refill", time: "5 mins ago" },
    { id: "2", table: "T-12", message: "Requested the bill check", time: "1 min ago" },
  ]));

  // Subscribe to real-time customer requests
  useEffect(() => {
    return realtimeService.subscribe((eventType, data) => {
      if (eventType === "request:new") {
        setRequests((prev) => [data, ...prev]);
        toast.info(`New request from Table ${data.table}!`, { description: data.message });
      }
    });
  }, []);

  function resolveRequest(id: string) {
    setRequests(requests.filter((r) => r.id !== id));
    toast.success("Request resolved!");
  }

  // Table status edit grid
  const [tables, setTables] = useState<Table[]>(() => loadStored("smartserve:staff-tables", TABLES));

  useEffect(() => saveStored("smartserve:staff-reservations", reservations), [reservations]);
  useEffect(() => saveStored("smartserve:staff-tasks", tasks), [tasks]);
  useEffect(() => saveStored("smartserve:staff-requests", requests), [requests]);
  useEffect(() => saveStored("smartserve:staff-tables", tables), [tables]);
  function toggleTableStatus(id: string, nextStatus: Table["status"]) {
    setTables(tables.map((t) => (t.id === id ? { ...t, status: nextStatus } : t)));
    toast.success(`Table ${id} status changed to ${nextStatus}`);
    realtimeService.publish("table:status", { tableId: id, status: nextStatus });
  }

  const { notifications, markAsRead } = useNotifications();

  return (
    <DashboardLayout
      role="staff"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={TABS}
    >
      {/* 1. TODAY'S ORDERS */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          <h2 className="font-display text-3xl italic text-white text-left">Today's Orders</h2>
          <div className="bg-[#121214] border border-[#1e1e24] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#1e1e24] text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa] text-left">
              <span className="col-span-3">Order ID</span>
              <span className="col-span-2">Table</span>
              <span className="col-span-4">Items</span>
              <span className="col-span-3 text-right">Status</span>
            </div>
            {tickets.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-[#1e1e24]/50 items-center text-left"
              >
                <span className="col-span-3 font-mono text-xs text-white">{t.id}</span>
                <span className="col-span-2 font-mono text-sm text-primary">{t.table}</span>
                <span className="col-span-4 text-xs text-muted-foreground">
                  {t.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                </span>
                <div className="col-span-3 text-right">
                  <span className="text-[10px] font-mono uppercase px-2.5 py-1 bg-white/5 border border-white/10 rounded text-white">
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. KITCHEN QUEUE */}
      {activeTab === "kitchen" && (
        <div className="space-y-6">
          <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa]">
                Operations pass
              </span>
              <h2 className="font-display text-3xl italic text-white mt-1">Kitchen Queue.</h2>
            </div>
            <label className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa]">
              <input
                type="checkbox"
                checked={showServed}
                onChange={(e) => setShowServed(e.target.checked)}
              />
              Show served
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KanbanColumn title="Queued" count={byStatus.queued.length} tint="text-white/60">
              {byStatus.queued.map((t) => (
                <TicketCard key={t.id} t={t} now={now} onBump={bump} onRecall={recall} />
              ))}
            </KanbanColumn>
            <KanbanColumn title="Preparing" count={byStatus.preparing.length} tint="text-primary">
              {byStatus.preparing.map((t) => (
                <TicketCard key={t.id} t={t} now={now} onBump={bump} onRecall={recall} />
              ))}
            </KanbanColumn>
            <KanbanColumn title="Ready · Pass" count={byStatus.ready.length} tint="text-accent">
              {byStatus.ready.map((t) => (
                <TicketCard key={t.id} t={t} now={now} onBump={bump} onRecall={recall} />
              ))}
            </KanbanColumn>
          </div>
        </div>
      )}

      {/* 3. ASSIGNED TABLES */}
      {activeTab === "assigned" && (
        <div className="space-y-6">
          <h2 className="font-display text-3xl italic text-white text-left">Your Tables</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {tables.slice(0, 4).map((t) => (
              <div key={t.id} className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-5 text-left">
                <span className="text-[10px] font-mono text-primary uppercase">{t.id}</span>
                <h3 className="font-display italic text-2xl text-white mt-2">{t.seats} seats</h3>
                <div className="mt-3 flex gap-1.5 flex-wrap">
                  {["free", "occupied", "reserved", "cleaning"].map((st) => (
                    <button
                      key={st}
                      onClick={() => toggleTableStatus(t.id, st as any)}
                      className={
                        "px-2 py-0.5 rounded text-[8px] font-mono uppercase border cursor-pointer " +
                        (t.status === st
                          ? "bg-primary border-primary text-primary-foreground font-bold"
                          : "border-[#1e1e24] text-muted-foreground hover:text-white")
                      }
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. RESERVATIONS */}
      {activeTab === "reservations" && (
        <div className="space-y-6">
          <h2 className="font-display text-3xl italic text-white text-left">Guest Check-In</h2>
          <div className="bg-[#121214] border border-[#1e1e24] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#1e1e24] text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa] text-left">
              <span className="col-span-3">Guest</span>
              <span className="col-span-2">Party</span>
              <span className="col-span-3">Time</span>
              <span className="col-span-4 text-right">Action</span>
            </div>
            {reservations.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-[#1e1e24]/50 items-center text-left"
              >
                <span className="col-span-3 font-semibold text-white">{r.name}</span>
                <span className="col-span-2 font-mono text-xs text-muted-foreground">{r.party} Guests</span>
                <span className="col-span-3 font-mono text-xs text-muted-foreground">{r.time}</span>
                <div className="col-span-4 text-right flex justify-end gap-2">
                  {["Seated", "Arrived", "No Show"].map((st) => (
                    <button
                      key={st}
                      onClick={() => checkInRes(r.id, st)}
                      className={
                        "px-2 py-1 rounded text-[8px] font-mono uppercase border cursor-pointer " +
                        (r.status === st
                          ? "bg-primary border-primary text-primary-foreground font-bold"
                          : "border-[#1e1e24] text-muted-foreground hover:text-white")
                      }
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. TASKS */}
      {activeTab === "tasks" && (
        <div className="space-y-6">
          <h2 className="font-display text-3xl italic text-white text-left">Server Duty Tasks</h2>
          <div className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-5 space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 text-left"
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  readOnly
                  className="size-4 accent-primary"
                />
                <span className={"text-sm " + (task.done ? "line-through text-muted-foreground" : "text-white")}>
                  {task.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. CUSTOMER REQUESTS */}
      {activeTab === "requests" && (
        <div className="space-y-6">
          <h2 className="font-display text-3xl italic text-white text-left">Customer Service Requests</h2>
          <div className="space-y-3">
            {requests.map((r) => (
              <div
                key={r.id}
                className="bg-[#121214] border border-primary/20 rounded-2xl p-5 flex justify-between items-center text-left"
              >
                <div>
                  <span className="text-[10px] font-mono text-primary uppercase">Table {r.table}</span>
                  <h4 className="text-sm font-semibold text-white mt-1">{r.message}</h4>
                  <span className="text-[9px] font-mono text-muted-foreground mt-1 block">{r.time}</span>
                </div>
                <button
                  onClick={() => resolveRequest(r.id)}
                  className="px-4 py-2 bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-widest rounded-full hover:opacity-90 cursor-pointer"
                >
                  Mark Done
                </button>
              </div>
            ))}
            {requests.length === 0 && (
              <p className="text-xs text-muted-foreground italic py-10 text-center">
                All requests answered! Check back when guests call.
              </p>
            )}
          </div>
        </div>
      )}

      {/* 7. TABLE STATUS */}
      {activeTab === "tables" && (
        <div className="space-y-6">
          <h2 className="font-display text-3xl italic text-white text-left">Status Control</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tables.map((t) => (
              <div
                key={t.id}
                className="bg-[#121214] border border-[#1e1e24] rounded-xl p-4 flex justify-between items-center text-left"
              >
                <div>
                  <span className="font-mono text-xs text-white">{t.id}</span>
                  <span className="text-xs text-muted-foreground ml-3">({t.seats} seats)</span>
                </div>
                <div className="flex gap-1">
                  {(["free", "occupied", "reserved", "cleaning"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => toggleTableStatus(t.id, st)}
                      className={
                        "px-2 py-0.5 rounded text-[8px] font-mono uppercase border cursor-pointer " +
                        (t.status === st
                          ? "bg-accent border-accent text-accent-foreground font-bold"
                          : "border-[#1e1e24] text-muted-foreground hover:text-white")
                      }
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. NOTIFICATIONS */}
      {activeTab === "notifications" && (
        <div className="max-w-xl mx-auto space-y-4">
          <h2 className="font-display text-3xl italic text-white mb-6">Recent Alerts</h2>
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
          {notifications.length === 0 && (
            <p className="text-xs text-muted-foreground italic py-10 text-center">
              No new alerts.
            </p>
          )}
        </div>
      )}

      {/* 9. PROFILE */}
      {activeTab === "profile" && (
        <div className="max-w-md mx-auto">
          <div className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-6 text-left">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa] mb-2 block">
              Staff ID Card
            </span>
            <h3 className="font-display italic text-2xl text-white mb-4">Credentials</h3>
            <div className="space-y-3">
              <div>
                <span className="text-[9px] font-mono uppercase text-muted-foreground block">Name</span>
                <span className="text-sm text-white font-medium">{user?.name}</span>
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase text-muted-foreground block">Email</span>
                <span className="text-sm text-white font-medium">{user?.email}</span>
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase text-muted-foreground block">Role Authorization</span>
                <span className="text-xs font-mono text-primary uppercase">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default StaffPortalPage;
