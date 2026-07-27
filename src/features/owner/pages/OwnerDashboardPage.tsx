import React, { useState } from "react";
import { DashboardLayout } from "@/features/shared/components/DashboardLayout";
import { RevenueChart } from "@/features/manager/components/RevenueChart";
import { PeakHoursChart } from "@/features/manager/components/PeakHoursChart";
import { useAnalytics } from "@/features/manager/hooks/useAnalytics";
import { OpsCopilot } from "@/features/ai/components/OpsCopilot";
import { RESTAURANTS } from "@/lib/mock-data";
import {
  TrendingUp,
  DollarSign,
  Coins,
  FileSpreadsheet,
  LineChart,
  Map,
  UserCheck,
  Users,
  ShieldAlert,
  Megaphone,
  Sparkles,
  Settings as SettingsIcon,
} from "lucide-react";
import { toast } from "sonner";
import { downloadTextFile, loadStored, saveStored } from "@/lib/browser-storage";

const TABS = [
  { id: "overview", label: "Business Overview", icon: TrendingUp },
  { id: "revenue", label: "Revenue", icon: DollarSign },
  { id: "profit", label: "Profit", icon: Coins },
  { id: "financials", label: "Financial Reports", icon: FileSpreadsheet },
  { id: "analytics", label: "Business Analytics", icon: LineChart },
  { id: "branches", label: "Branch Performance", icon: Map },
  { id: "employees", label: "Employee Performance", icon: UserCheck },
  { id: "users", label: "User Management", icon: Users },
  { id: "roles", label: "Role Management", icon: ShieldAlert },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "ai", label: "AI Business Advisor", icon: Sparkles },
  { id: "settings", label: "System Settings", icon: SettingsIcon },
];

export function OwnerDashboardPage() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { salesByDay, hourly } = useAnalytics();

  // Multi-tenant users list
  const [users, setUsers] = useState(() =>
    loadStored("smartserve:owner-users", [
      { id: "u1", name: "Emily Johnson", email: "emily@nook.co", role: "customer" },
      { id: "u2", name: "Sarah Paulson", email: "sarah@nook.co", role: "staff" },
      { id: "u3", name: "John Davis", email: "john@nook.co", role: "staff" },
      { id: "u4", name: "Dipanshu", email: "manager@nook.co", role: "manager" },
    ]),
  );
  const [settings, setSettings] = useState(() =>
    loadStored("smartserve:owner-settings", { stripeAccountId: "acct_1048992" }),
  );

  function changeRole(userId: string, newRole: string) {
    const next = users.map((u) => (u.id === userId ? { ...u, role: u.id === "u4" ? u.role : newRole } : u));
    setUsers(next);
    saveStored("smartserve:owner-users", next);
    toast.success("Role updated successfully!");
  }

  function downloadFinancialReport(title: string) {
    const rows = ["Report,Period,Generated at", `"${title}","Q2 2026","${new Date().toISOString()}"`];
    downloadTextFile(`${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`, `${rows.join("\n")}\n`, "text/csv;charset=utf-8");
    toast.success("CSV downloaded");
  }

  function saveSettings() {
    saveStored("smartserve:owner-settings", settings);
    toast.success("Corporate settings saved!");
  }

  // Branch KPIs
  const totalMRR = RESTAURANTS.reduce((s, r) => s + r.monthly, 0);
  const liveCount = RESTAURANTS.filter((r) => r.status !== "off").length;

  return (
    <DashboardLayout
      role="owner"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      tabs={TABS}
    >
      {/* 1. BUSINESS OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["Active Restaurants", RESTAURANTS.length.toString()],
              ["Live Now", liveCount.toString()],
              ["Total MRR", `₹${(totalMRR / 100000).toFixed(1)}L`],
              ["Avg. Fleet occupancy", "50%"],
            ].map(([k, v]) => (
              <div key={k} className="border border-[#1e1e24] rounded-xl p-5 bg-[#121214] text-left">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa] mb-2">
                  {k}
                </div>
                <div className="font-display italic text-3xl text-white">{v}</div>
              </div>
            ))}
          </div>

          <div className="border border-[#1e1e24] rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#1e1e24] text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa] text-left">
              <span className="col-span-4">Restaurant</span>
              <span className="col-span-3">City</span>
              <span className="col-span-3">Monthly Revenue</span>
              <span className="col-span-2 text-right">Status</span>
            </div>
            {RESTAURANTS.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-[#1e1e24]/50 hover:bg-white/5 transition-colors items-center text-left"
              >
                <span className="col-span-4 font-display italic text-lg text-white">{r.name}</span>
                <span className="col-span-3 text-sm text-muted-foreground">{r.city}</span>
                <span className="col-span-3 font-mono text-sm text-primary">
                  ₹{(r.monthly / 100000).toFixed(1)}L
                </span>
                <span className="col-span-2 text-right text-[10px] font-mono uppercase tracking-widest text-accent">
                  ● {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. REVENUE */}
      {activeTab === "revenue" && (
        <div className="space-y-6">
          <h2 className="font-display text-3xl italic text-white text-left">Revenue Timeline</h2>
          <RevenueChart data={salesByDay} />
        </div>
      )}

      {/* 3. PROFIT */}
      {activeTab === "profit" && (
        <div className="space-y-6 text-left">
          <h2 className="font-display text-3xl italic text-white">Profit Margins</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              ["Gross Profit Margin", "68.2%", "Target: 70%"],
              ["Labor Cost Ratio", "28.4%", "Target: 25%"],
              ["COGS Percentage", "31.8%", "Target: 30%"],
            ].map(([k, v, s]) => (
              <div key={k} className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-5">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#a1a1aa]">{k}</span>
                <div className="font-display italic text-3xl text-white mt-2">{v}</div>
                <span className="text-[10px] text-muted-foreground mt-1 block">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. FINANCIAL REPORTS */}
      {activeTab === "financials" && (
        <div className="space-y-6 text-left">
          <h2 className="font-display text-3xl italic text-white">Corporate Statement Logs</h2>
          <div className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-5 space-y-4">
            {[
              "Consolidated Profit & Loss (Q2 2026)",
              "Capital Expenditure Log - Renovations",
              "Franchise Tax Audit Checklist 2025"
            ].map((f, i) => (
              <div key={i} className="flex justify-between items-center border-b border-[#1e1e24] pb-3 last:border-0 last:pb-0">
                <span className="text-sm text-white">{f}</span>
                <button
                  onClick={() => downloadFinancialReport(f)}
                  className="px-3 py-1 bg-white text-black text-[9px] font-mono uppercase tracking-widest rounded"
                >
                  View CSV
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. BUSINESS ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="space-y-8">
          <h2 className="font-display text-3xl italic text-white text-left">Year-over-Year (YoY) Margins</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart data={salesByDay} />
            <PeakHoursChart data={hourly} />
          </div>
        </div>
      )}

      {/* 6. BRANCH PERFORMANCE */}
      {activeTab === "branches" && (
        <div className="space-y-6 text-left">
          <h2 className="font-display text-3xl italic text-white">Branch Margins</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              ["The Nook (Bengaluru)", "₹14.8L MRR", "24.2% net margin"],
              ["Olive & Ember (Goa)", "₹11.2L MRR", "18.8% net margin"],
              ["Avenue Bistro (Hyderabad)", "₹8.8L MRR", "14.2% net margin"],
            ].map(([k, v, s]) => (
              <div key={k} className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-5">
                <span className="text-xs font-semibold text-white">{k}</span>
                <div className="font-display italic text-2xl text-primary mt-2">{v}</div>
                <span className="text-[10px] text-muted-foreground mt-1 block">{s}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. EMPLOYEE PERFORMANCE */}
      {activeTab === "employees" && (
        <div className="space-y-6 text-left">
          <h2 className="font-display text-3xl italic text-white">Server & Kitchen Metrics</h2>
          <div className="bg-[#121214] border border-[#1e1e24] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#1e1e24] text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa]">
              <span className="col-span-4">Staff</span>
              <span className="col-span-4">Average Ticket size</span>
              <span className="col-span-4 text-right">Tables Handled</span>
            </div>
            {[
              ["Sarah P.", "₹1,250", "28 tables"],
              ["John D.", "₹1,100", "22 tables"],
              ["Mark R.", "₹950", "19 tables"],
            ].map(([name, avg, cnt], i) => (
              <div key={i} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-[#1e1e24]/50">
                <span className="col-span-4 font-semibold text-white">{name}</span>
                <span className="col-span-4 font-mono text-xs text-primary">{avg}</span>
                <span className="col-span-4 text-right font-mono text-xs text-muted-foreground">{cnt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. USER MANAGEMENT */}
      {activeTab === "users" && (
        <div className="space-y-6 text-left">
          <h2 className="font-display text-3xl italic text-white">Registered Users</h2>
          <div className="bg-[#121214] border border-[#1e1e24] rounded-2xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-[#1e1e24] text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa]">
              <span className="col-span-4">Name</span>
              <span className="col-span-4">Email</span>
              <span className="col-span-4 text-right">Role</span>
            </div>
            {users.map((u) => (
              <div key={u.id} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-[#1e1e24]/50 items-center">
                <span className="col-span-4 font-semibold text-white">{u.name}</span>
                <span className="col-span-4 font-mono text-xs text-muted-foreground">{u.email}</span>
                <div className="col-span-4 text-right">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value)}
                    className="bg-[#18181b] border border-[#1e1e24] rounded px-2 py-1 text-xs text-white"
                  >
                    <option value="customer">customer</option>
                    <option value="staff">staff</option>
                    <option value="manager">manager</option>
                    <option value="owner">owner</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. ROLE MANAGEMENT */}
      {activeTab === "roles" && (
        <div className="space-y-6 text-left">
          <h2 className="font-display text-3xl italic text-white">Authorization Permissions</h2>
          <div className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-5 space-y-3">
            {[
              ["customer", "view_menu, reserve_table, track_orders, manage_profile"],
              ["staff", "view_assigned_orders, update_order_status, manage_tables, receive_tasks"],
              ["manager", "manage_operations, access_inventory, access_analytics, access_copilot"],
              ["owner", "full_access (global administrative access)"],
            ].map(([r, p], i) => (
              <div key={i} className="border-b border-[#1e1e24] pb-3 last:border-0 last:pb-0">
                <span className="text-xs font-mono text-primary uppercase">{r}</span>
                <p className="text-xs text-muted-foreground mt-1">{p}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. MARKETING */}
      {activeTab === "marketing" && (
        <div className="space-y-6 text-left">
          <h2 className="font-display text-3xl italic text-white">Campaign Promotions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              ["Early Bird Pasta Promo", "15% off Tagliatelle between 5-6 PM.", "Active"],
              ["Wine Pairing incentive", "Pinot Grigio suggestions to guests cart.", "Paused"],
            ].map(([title, desc, status], i) => (
              <div key={i} className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-5 flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-semibold text-white">{title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{desc}</p>
                </div>
                <span
                  className={
                    "text-[10px] font-mono uppercase px-2.5 py-1 rounded " +
                    (status === "Active" ? "bg-accent/15 text-accent border border-accent/20" : "bg-white/5 text-muted border border-white/10")
                  }
                >
                  {status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. AI ADVISOR */}
      {activeTab === "ai" && (
        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa]">
              Executive strategist
            </span>
            <h2 className="font-display text-3xl italic text-white mt-1">AI Business Advisor.</h2>
          </div>
          <OpsCopilot />
        </div>
      )}

      {/* 12. SYSTEM SETTINGS */}
      {activeTab === "settings" && (
        <div className="max-w-md mx-auto">
          <div className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-6 text-left space-y-4">
            <h3 className="font-display italic text-2xl text-white">Multi-tenant configurations</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[9px] font-mono uppercase text-muted-foreground block">
                  Stripe Live Account ID
                </label>
                <input
                  type="text"
                  value={settings.stripeAccountId}
                  onChange={(event) => setSettings({ stripeAccountId: event.target.value })}
                  className="mt-1 w-full bg-background border border-[#1e1e24] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>
              <button
                onClick={saveSettings}
                className="w-full py-3 bg-primary text-primary-foreground text-[10px] font-mono uppercase tracking-widest rounded-full hover:opacity-90 cursor-pointer"
              >
                Save global configurations
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
export default OwnerDashboardPage;
