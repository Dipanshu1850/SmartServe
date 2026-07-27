import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "SmartServe — AI Operating System for Modern Restaurants",
      },
      {
        name: "description",
        content:
          "SmartServe is an AI-powered, real-time restaurant operating system with role-based dashboards, business intelligence, predictive analytics, and an AI Operations Copilot.",
      },
      {
        property: "og:title",
        content: "SmartServe — AI Restaurant Operating System",
      },
      {
        property: "og:description",
        content:
          "Real-time operations, business intelligence, and predictive analytics for modern restaurants. One platform, every role.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "SmartServe — AI Restaurant Operating System",
      },
      {
        name: "twitter:description",
        content:
          "AI-powered real-time restaurant OS with multi-role dashboards and proactive operations intelligence.",
      },
    ],
  }),
  component: Landing,
});

const LIVE_CHANNELS = [
  "Live Orders",
  "Live Reservations",
  "Live Inventory",
  "Live Kitchen Queue",
  "Live Notifications",
  "Live Analytics",
] as const;

const BI_METRICS = [
  { label: "Restaurant Health", value: "94", unit: "/100", trend: "+3 vs last week" },
  { label: "Revenue Today", value: "₹4.82L", unit: "", trend: "+12% vs forecast" },
  { label: "Active Orders", value: "23", unit: "", trend: "6 in kitchen queue" },
  { label: "Reservations", value: "18", unit: " tonight", trend: "4 arriving next hour" },
  { label: "Guest Satisfaction", value: "4.8", unit: "/5", trend: "Based on 142 reviews" },
  { label: "Avg Wait Time", value: "11", unit: " min", trend: "−2 min vs peak" },
] as const;

const FORECASTS = [
  {
    title: "Revenue Forecast",
    value: "₹6.1L",
    detail: "Projected Saturday dinner service",
    confidence: "92% confidence",
  },
  {
    title: "Demand Forecast",
    value: "198 covers",
    detail: "Expected peak 7–9 PM",
    confidence: "Based on 6-week trend",
  },
  {
    title: "Peak Hours",
    value: "7–8 PM",
    detail: "52–61 covers per hour",
    confidence: "Tonight's busiest window",
  },
  {
    title: "Inventory Forecast",
    value: "3 items",
    detail: "Below reorder threshold by Friday",
    confidence: "Wagyu, truffle butter, burrata",
  },
  {
    title: "Staff Requirement",
    value: "+2 servers",
    detail: "Recommended for Saturday shift",
    confidence: "Covers-to-staff ratio",
  },
  {
    title: "Weekend Prediction",
    value: "+18%",
    detail: "Cover volume vs weekday avg",
    confidence: "Fri–Sun composite",
  },
] as const;

const COPILOT_CAPABILITIES = [
  "Business Intelligence",
  "Inventory Forecasting",
  "Demand Prediction",
  "Revenue Analysis",
  "Operational Recommendations",
  "Staff Optimization",
  "Reservation Analysis",
  "Restaurant Health",
] as const;

const PLATFORM_FEATURES = [
  {
    title: "AI Operations Advisor",
    desc: "Proactive recommendations across inventory, staffing, and revenue — not just Q&A.",
  },
  {
    title: "Real-Time Collaboration",
    desc: "Orders, tables, and kitchen queues stay synchronized across every dashboard.",
  },
  {
    title: "Role-Based Dashboards",
    desc: "Purpose-built views for customers, staff, managers, and owners.",
  },
  {
    title: "Inventory Management",
    desc: "Live stock levels, reorder alerts, and AI-driven waste reduction.",
  },
  {
    title: "Reservations",
    desc: "Queue management, table assignment, and arrival flow in one pane.",
  },
  {
    title: "Analytics",
    desc: "Revenue, peak hours, and operational KPIs updated in real time.",
  },
  {
    title: "Notifications",
    desc: "Instant alerts for orders, tables, inventory, and shift events.",
  },
  {
    title: "Predictive Analytics",
    desc: "Forecasts for demand, revenue, inventory, and staffing needs.",
  },
] as const;

const ROLE_DEMOS = [
  {
    role: "Customer",
    desc: "Live order tracking, table sessions, and reservation status.",
    to: "/customer" as const,
    tag: "Guest-facing",
  },
  {
    role: "Staff",
    desc: "Kitchen queue, table map, tasks, and shift coordination.",
    to: "/staff" as const,
    tag: "Front & back of house",
  },
  {
    role: "Manager",
    desc: "Operations overview, inventory, analytics, and AI copilot.",
    to: "/manager" as const,
    tag: "Day-to-day ops",
  },
  {
    role: "Owner",
    desc: "Multi-location health, revenue, and fleet-wide intelligence.",
    to: "/owner" as const,
    tag: "Executive view",
  },
] as const;

const TECH_STACK = [
  { name: "Gemini AI", role: "Operations intelligence & forecasting" },
  { name: "Supabase Realtime", role: "Live sync across dashboards" },
  { name: "PostgreSQL", role: "Transactional data & analytics" },
  { name: "TanStack Start", role: "Full-stack React application" },
  { name: "TypeScript", role: "End-to-end type safety" },
  { name: "Tailwind CSS", role: "Consistent design system" },
] as const;

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      <SiteNav />

      {/* Hero */}
      <section className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
        <div className="max-w-[85ch] animate-in">
          <span className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-mono uppercase tracking-widest text-primary">
            <span className="size-1.5 rounded-full bg-primary pulse-status" />
            AI-Powered Restaurant Operating System
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display text-balance leading-[0.95] mb-8 tracking-tighter">
            Real-time restaurant operations,{" "}
            <span className="italic text-primary">powered by AI.</span>
          </h1>
          <p className="text-xl text-muted max-w-[58ch] text-pretty leading-relaxed mb-10">
            SmartServe is not a menu site or a POS — it is a unified operating system for modern
            restaurants. Multi-role dashboards, live synchronization, business intelligence, and an
            AI copilot that forecasts, recommends, and optimizes — all in one platform.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#demo-roles"
              className="px-5 py-3 bg-foreground text-background rounded-full text-xs font-mono uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Explore Role Dashboards →
            </a>
            <Link
              to="/manager"
              className="px-5 py-3 border border-border rounded-full text-xs font-mono uppercase tracking-widest hover:bg-foreground/5 transition-colors"
            >
              Open Operations Console
            </Link>
          </div>
        </div>

        {/* Differentiator strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 border-y border-border py-4 mt-16 animate-in">
          {[
            ["01", "Real-Time Sync Engine"],
            ["02", "AI Operations Copilot"],
            ["03", "Multi-Role Dashboards"],
          ].map(([n, label], i) => (
            <div
              key={n}
              className={
                "flex items-center gap-3 px-4 py-2 " +
                (i === 1 ? "border-x border-border" : "")
              }
            >
              <span className="text-[10px] font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">
                {n}
              </span>
              <span className="text-sm font-medium tracking-tight">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Live sync strip */}
      <section className="border-b border-border bg-secondary/40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted shrink-0">
              Synchronized in real time
            </span>
            {LIVE_CHANNELS.map((channel) => (
              <span
                key={channel}
                className="inline-flex items-center gap-2 text-xs font-medium text-foreground/80"
              >
                <span className="size-1.5 rounded-full bg-accent pulse-status" />
                {channel}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard previews — Customer + Staff (existing split, improved) */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-6 animate-in">
          <div className="flex items-end justify-between border-b border-border pb-2">
            <h3 className="font-display italic text-2xl">Customer Dashboard</h3>
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
              Table 14 · Session active
            </span>
          </div>
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border space-y-6">
            <img
              src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Restaurant%20ambiance%20preview%2C%20modern%20fine%20dining%20interior%2C%20warm%20lighting%2C%20professional%20photography&image_size=landscape_4_3"
              alt="Restaurant ambiance preview"
              width={1024}
              height={768}
              loading="lazy"
              className="w-full aspect-[4/3] object-cover rounded-xl opacity-90"
            />
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="text-lg font-semibold">Live Order Session</h4>
                  <p className="text-sm text-muted">
                    Track order status, table activity, and service updates in real time.
                  </p>
                </div>
                <span className="font-mono text-primary shrink-0">#ORD-1042</span>
              </div>
              <div className="space-y-2">
                {[
                  ["Order placed", "6:42 PM", true],
                  ["Kitchen preparing", "6:44 PM", true],
                  ["Ready for service", "Est. 6:52 PM", false],
                ].map(([step, time, done]) => (
                  <div key={step as string} className="flex items-center gap-3 text-sm">
                    <span
                      className={
                        "size-2 rounded-full shrink-0 " +
                        (done ? "bg-primary" : "bg-border")
                      }
                    />
                    <span className={done ? "font-medium" : "text-muted"}>{step as string}</span>
                    <span className="ml-auto font-mono text-[10px] text-muted">{time as string}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-primary/5 border border-primary/20 rounded-full">
                  <span className="size-1.5 rounded-full bg-primary pulse-status" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">
                    Live sync active
                  </span>
                </span>
                <span className="inline-flex items-center gap-2 px-2.5 py-1 bg-accent/5 border border-accent/20 rounded-full">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-tighter">
                    AI: Pair with Amber Sour
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6 animate-in">
          <div className="flex items-end justify-between border-b border-border pb-2">
            <h3 className="font-display italic text-2xl">Staff Dashboard</h3>
            <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
              Active Shift: Dinner
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface text-surface-foreground rounded-2xl p-4 shadow-xl">
              <div className="flex justify-between mb-4 border-b border-white/10 pb-2">
                <span className="text-[10px] font-mono opacity-50">ORDERS KANBAN</span>
                <span className="text-[10px] font-mono">3 IN KITCHEN</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px] text-primary">#ORD-1042</span>
                    <span className="text-[10px] font-mono opacity-80">T-12 · 4m</span>
                  </div>
                  <p className="text-xs">2× Ribeye, 1× Sea Bass</p>
                </div>
                <div className="p-3 bg-white/10 border border-white/20 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px] text-primary">#ORD-1045</span>
                    <span className="text-[10px] font-mono opacity-80">T-04 · 1m</span>
                  </div>
                  <p className="text-xs">4× Amber Sour</p>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-mono text-[10px] text-primary">#ORD-1046</span>
                    <span className="text-[10px] font-mono opacity-80">T-08 · 8m</span>
                  </div>
                  <p className="text-xs">2× Tagliatelle, 1× Burrata</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <span className="size-2 rounded-full bg-accent pulse-status" />
                <span className="font-mono text-[10px] tracking-widest">OPS COPILOT</span>
              </div>
              <div className="flex-1 space-y-4">
                <div className="bg-secondary p-3 rounded-lg border border-border/50">
                  <p className="text-[11px] text-muted italic mb-2">
                    "What's our projected waste for tonight?"
                  </p>
                  <div className="flex items-end gap-1 h-12 mb-2">
                    {[40, 60, 90, 30, 50].map((h, i) => (
                      <div
                        key={i}
                        className={i === 2 ? "flex-1 bg-accent" : "flex-1 bg-accent/20"}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] font-medium leading-tight">
                    High chance of steak surplus. Recommend 'Chef's Choice' special for tables 8–12.
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted">Type a query…</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono border border-border">
                    ⌘K
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Manager + Owner previews (new row, same section) */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-end justify-between border-b border-border pb-2">
              <h3 className="font-display italic text-xl">Manager Dashboard</h3>
              <span className="font-mono text-[10px] text-muted uppercase tracking-widest">
                Business Overview
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                ["Revenue", "₹4.82L"],
                ["Covers", "128"],
                ["Turn Time", "42m"],
                ["Health", "94/100"],
              ].map(([k, v]) => (
                <div key={k} className="bg-secondary/60 rounded-lg p-3 border border-border/50">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-muted">{k}</p>
                  <p className="text-lg font-semibold mt-1">{v}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Inventory alerts, reservations, kitchen flow, and AI copilot — unified for shift
              managers.
            </p>
          </div>

          <div className="bg-surface text-surface-foreground rounded-2xl p-5 space-y-4">
            <div className="flex items-end justify-between border-b border-white/10 pb-2">
              <h3 className="font-display italic text-xl">Owner Dashboard</h3>
              <span className="font-mono text-[10px] opacity-60 uppercase tracking-widest">
                Fleet Intelligence
              </span>
            </div>
            <div className="space-y-2">
              {[
                ["The Nook — Downtown", "Health 94 · ₹12.4L/wk"],
                ["The Nook — Westside", "Health 88 · ₹9.1L/wk"],
                ["The Nook — Airport", "Health 91 · ₹14.2L/wk"],
              ].map(([name, stats]) => (
                <div
                  key={name}
                  className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-lg text-sm"
                >
                  <span>{name}</span>
                  <span className="font-mono text-[10px] opacity-70">{stats}</span>
                </div>
              ))}
            </div>
            <p className="text-xs opacity-70 leading-relaxed">
              Multi-location health scores, revenue roll-ups, and executive-level AI insights.
            </p>
          </div>
        </div>
      </section>

      {/* Business intelligence */}
      <section className="border-y border-border bg-secondary/30 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 max-w-2xl">
            <span className="font-mono text-[10px] text-primary tracking-[0.2em] uppercase mb-2 block">
              Business Intelligence
            </span>
            <h2 className="text-3xl md:text-4xl font-display italic tracking-tight">
              Measurable value, updated live.
            </h2>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              High-signal KPIs surfaced across the platform — not buried in reports.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {BI_METRICS.map((m) => (
              <div
                key={m.label}
                className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors"
              >
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted">
                  {m.label}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight">
                  {m.value}
                  <span className="text-sm font-normal text-muted">{m.unit}</span>
                </p>
                <p className="mt-2 text-[10px] text-muted leading-snug">{m.trend}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Operations Copilot — dedicated section (enhanced from preview card) */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="font-mono text-[10px] text-accent tracking-[0.2em] uppercase mb-2 block">
              AI Operations Copilot
            </span>
            <h2 className="text-3xl md:text-4xl font-display italic tracking-tight text-balance">
              Proactive intelligence, not a chatbot.
            </h2>
            <p className="mt-4 text-muted leading-relaxed max-w-[48ch]">
              SmartServe AI monitors restaurant health, forecasts demand, and surfaces operational
              recommendations before problems escalate — embedded directly in the manager workflow.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {COPILOT_CAPABILITIES.map((cap) => (
                <span
                  key={cap}
                  className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider bg-accent/5 border border-accent/20 rounded-full text-accent"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-accent pulse-status" />
              <span className="font-mono text-[10px] tracking-widest">LIVE AI INSIGHTS</span>
            </div>
            {[
              {
                type: "Recommendation",
                text: "Schedule +2 servers for Saturday 7–9 PM — covers forecast 18% above baseline.",
              },
              {
                type: "Forecast",
                text: "Wagyu ribeye will 86 by Friday unless reordered today. Suggested qty: 8 kg.",
              },
              {
                type: "Health",
                text: "Restaurant health score 94/100. Inventory and wait times trending positive.",
              },
            ].map((insight) => (
              <div
                key={insight.text}
                className="p-4 bg-secondary/60 rounded-xl border border-border/50"
              >
                <span className="text-[10px] font-mono uppercase tracking-widest text-primary">
                  {insight.type}
                </span>
                <p className="mt-2 text-sm leading-relaxed">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Predictive analytics */}
      <section className="bg-surface text-surface-foreground py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 max-w-2xl">
            <span className="font-mono text-[10px] text-primary tracking-[0.2em] uppercase mb-2 block">
              Predictive Analytics
            </span>
            <h2 className="text-3xl md:text-4xl font-display italic">See what's coming.</h2>
            <p className="mt-3 text-sm opacity-70 leading-relaxed">
              AI-generated forecasts help operators plan inventory, staffing, and revenue — before
              the rush hits.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FORECASTS.map((f) => (
              <div
                key={f.title}
                className="p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/[0.07] transition-colors"
              >
                <p className="text-[10px] font-mono uppercase tracking-widest opacity-50">
                  {f.title}
                </p>
                <p className="mt-2 text-2xl font-semibold">{f.value}</p>
                <p className="mt-1 text-sm opacity-80">{f.detail}</p>
                <p className="mt-3 text-[10px] font-mono opacity-50">{f.confidence}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role demo cards */}
      <section id="demo-roles" className="max-w-7xl mx-auto px-6 py-24 scroll-mt-20">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <span className="font-mono text-[10px] text-primary tracking-[0.2em] uppercase mb-2 block">
            Live Demo
          </span>
          <h2 className="text-3xl md:text-4xl font-display italic">Explore every role.</h2>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            Jump into role-based dashboards to experience SmartServe as a customer, staff member,
            manager, or owner.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROLE_DEMOS.map((demo) => (
            <Link
              key={demo.role}
              to={demo.to}
              className="group p-6 bg-card border border-border rounded-2xl hover:border-primary/40 hover:shadow-sm transition-all"
            >
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary">
                {demo.tag}
              </span>
              <h3 className="mt-3 text-xl font-display italic group-hover:text-primary transition-colors">
                {demo.role}
              </h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">{demo.desc}</p>
              <span className="mt-4 inline-block text-[10px] font-mono uppercase tracking-widest text-foreground/60 group-hover:text-primary transition-colors">
                Open dashboard →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Platform features */}
      <section className="border-y border-border bg-secondary/20 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 max-w-2xl">
            <span className="font-mono text-[10px] text-primary tracking-[0.2em] uppercase mb-2 block">
              Platform
            </span>
            <h2 className="text-3xl md:text-4xl font-display italic">Everything in one OS.</h2>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              Consolidated capabilities — no overlapping modules, no duplicate workflows.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PLATFORM_FEATURES.map((f) => (
              <div
                key={f.title}
                className="p-5 bg-card border border-border rounded-xl hover:border-primary/20 transition-colors"
              >
                <h3 className="text-sm font-semibold">{f.title}</h3>
                <p className="mt-2 text-xs text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global console (existing section, improved copy) */}
      <section className="bg-surface text-surface-foreground py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
            <div>
              <span className="font-mono text-[10px] text-primary tracking-[0.2em] uppercase mb-2 block">
                Global Console
              </span>
              <h2 className="text-4xl font-display italic">Multi-location from day one.</h2>
              <p className="mt-3 text-sm opacity-70 max-w-md">
                Onboard new restaurants in minutes and monitor fleet health, revenue, and operations
                from a single executive pane.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/owner"
                className="px-6 py-3 border border-white/20 font-mono text-[10px] uppercase tracking-widest rounded hover:bg-white/5 transition-colors"
              >
                Owner Dashboard →
              </Link>
              <Link
                to="/owner"
                className="px-6 py-3 bg-primary text-primary-foreground font-mono text-[10px] uppercase tracking-widest rounded hover:opacity-90 transition-opacity"
              >
                Global Console →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-10 max-w-2xl">
          <span className="font-mono text-[10px] text-muted tracking-[0.2em] uppercase mb-2 block">
            Built on
          </span>
          <h2 className="text-2xl md:text-3xl font-display italic">
            Enterprise-grade infrastructure.
          </h2>
          <p className="mt-3 text-sm text-muted leading-relaxed">
            Supporting technologies that power real-time sync, AI intelligence, and reliable
            operations at scale.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TECH_STACK.map((t) => (
            <div
              key={t.name}
              className="flex flex-col gap-1 p-4 border border-border rounded-xl bg-card/50"
            >
              <span className="text-sm font-medium">{t.name}</span>
              <span className="text-xs text-muted">{t.role}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-display italic text-lg">SmartServe</span>
            <p className="mt-1 text-xs text-muted">
              AI Operating System for Modern Restaurants
            </p>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted">
            Real-time ops · Business intelligence · Predictive analytics
          </p>
        </div>
      </footer>
    </div>
  );
}
