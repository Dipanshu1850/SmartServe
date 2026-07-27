import React, { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { DemoService } from "@/features/demo/services/demo.service";
import { useNavigate } from "@tanstack/react-router";
import { Bell, LogOut, Menu, X, Check, Trash2, ShieldAlert } from "lucide-react";

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface DashboardLayoutProps {
  role: "customer" | "staff" | "manager" | "owner";
  activeTab: string;
  onTabChange: (tabId: any) => void;
  tabs: TabItem[];
  children: React.ReactNode;
}

export function DashboardLayout({
  role,
  activeTab,
  onTabChange,
  tabs,
  children,
}: DashboardLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const roleLabels: Record<string, string> = {
    customer: "Guest Portal",
    staff: "Staff Desk",
    manager: "Command Ops",
    owner: "Owner Suite",
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-foreground flex flex-col md:flex-row relative">
      {/* Real-time sync connection banner for alerts */}
      <div className="absolute top-4 right-4 z-40 flex items-center gap-3">
        {/* Notifications Trigger */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="size-10 bg-[#121214] border border-[#1e1e24] rounded-full flex items-center justify-center hover:bg-[#1a1a20] transition-colors relative cursor-pointer"
            aria-label="Toggle notifications"
          >
            <Bell className="size-4 text-muted-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 size-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Tray */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#121214] border border-[#1e1e24] rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between border-b border-[#1e1e24] pb-2 mb-3">
                <span className="text-xs font-mono uppercase tracking-widest text-muted">
                  Alerts ({unreadCount})
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={markAllAsRead}
                    className="text-[9px] font-mono text-primary uppercase tracking-wider hover:underline cursor-pointer"
                  >
                    Read All
                  </button>
                  <span className="text-muted text-[10px]">·</span>
                  <button
                    onClick={clearAll}
                    className="text-[9px] font-mono text-destructive uppercase tracking-wider hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-muted italic text-center py-6">
                    No new announcements.
                  </p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={
                        "p-3 rounded-lg border text-left transition-colors cursor-pointer " +
                        (n.read
                          ? "bg-[#18181b]/30 border-[#1e1e24]/50 opacity-60"
                          : "bg-[#1c1c24]/50 border-primary/20 hover:bg-[#1c1c24]")
                      }
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-medium text-white">{n.title}</span>
                        {!n.read && <span className="size-1.5 rounded-full bg-primary mt-1" />}
                      </div>
                      <p className="text-[10px] text-muted mt-1 leading-snug">{n.message}</p>
                      <span className="text-[8px] font-mono text-muted/50 mt-1 block">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Demo Mode Badge */}
        {DemoService.isDemoSession() && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/30 rounded-full">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-primary font-bold">
              Hackathon Demo
            </span>
          </span>
        )}

        {/* Live sync badge */}
        <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 bg-[#121214] border border-[#1e1e24] rounded-full">
          <span className="size-1.5 rounded-full bg-accent pulse-status" />
          <span className="text-[9px] font-mono uppercase tracking-widest text-[#a1a1aa]">
            ws · live
          </span>
        </span>
      </div>

      {/* Mobile Top Navbar */}
      <header className="md:hidden w-full h-16 bg-[#121214] border-b border-[#1e1e24] flex items-center justify-between px-6 z-30">
        <span className="font-display italic text-xl tracking-tight text-white">SmartServe</span>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="size-10 flex items-center justify-center bg-[#1c1c24] rounded border border-[#1e1e24] cursor-pointer"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={
          "w-full md:w-64 bg-[#121214] border-r border-[#1e1e24] flex flex-col z-30 md:static fixed inset-y-0 left-0 transition-transform duration-300 md:translate-x-0 " +
          (mobileOpen ? "translate-x-0 pt-16 md:pt-0" : "-translate-x-full md:translate-x-0")
        }
      >
        {/* Branding header */}
        <div className="p-6 hidden md:block">
          <span className="font-display italic text-2xl tracking-tighter text-white block">
            SmartServe
          </span>
          <span className="text-[9px] font-mono uppercase tracking-widest text-primary/70 block mt-1">
            {roleLabels[role]}
          </span>
        </div>

        {/* Tab Links */}
        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setMobileOpen(false);
                }}
                className={
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-left transition-all cursor-pointer " +
                  (active
                    ? "bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-[#1a1a20]")
                }
              >
                <Icon className="size-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* User Card */}
        {user && (
          <div className="p-4 border-t border-[#1e1e24] bg-[#0c0c0e]">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-[11px] font-bold text-white truncate">{user.name}</div>
                <div className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground truncate">
                  {user.role}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                DemoService.clearDemoSession();
                signOut();
                navigate({ to: "/" });
              }}
              className="w-full py-2 bg-transparent border border-destructive/30 text-destructive hover:bg-destructive/10 text-[9px] font-mono uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="size-3" />
              Sign out
            </button>
          </div>
        )}
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto w-full">
        <div className="max-w-7xl mx-auto pt-8 md:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
