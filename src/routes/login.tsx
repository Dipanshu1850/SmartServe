import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { DEMO_ACCOUNTS, useAuth, type Role } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · SmartServe" },
      { name: "description", content: "Sign in to SmartServe as diner, server, manager, or super admin." },
      { property: "og:title", content: "SmartServe Sign In" },
      { property: "og:description", content: "Pick a demo role to explore the SmartServe OS." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({ next: typeof s.next === "string" ? s.next : "/" }),
  component: Login,
});

const ROLE_ROUTES: Record<Role, string> = {
  diner: "/diner",
  server: "/kds",
  manager: "/dashboard",
  admin: "/admin",
};

function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const [email, setEmail] = useState("manager@nook.co");
  const [password, setPassword] = useState("demo");
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const account = DEMO_ACCOUNTS.find((a) => a.email === email.trim().toLowerCase());
    if (!account || password.length < 3) {
      setError("Use one of the demo accounts. Password: demo");
      return;
    }
    signIn(account);
    const target = next && next !== "/" ? next : ROLE_ROUTES[account.role];
    navigate({ to: target as never });
  }

  function quickIn(role: Role) {
    const account = DEMO_ACCOUNTS.find((a) => a.role === role)!;
    signIn(account);
    navigate({ to: ROLE_ROUTES[role] as never });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">
        <section className="space-y-6">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted">
            SmartServe · Access
          </span>
          <h1 className="font-display italic text-5xl leading-none">Sign in.</h1>
          <p className="text-sm text-muted max-w-md">
            Role-based access powers what you see. Managers get the command line, servers get the pass,
            diners get the menu. Super admins see the fleet.
          </p>
          <form onSubmit={submit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
              <p className="text-[10px] font-mono text-muted mt-1">Demo password: <span className="text-foreground">demo</span></p>
            </div>
            {error && <p className="text-[11px] font-mono text-destructive">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-primary text-primary-foreground text-[11px] font-mono uppercase tracking-widest"
            >
              Sign in →
            </button>
          </form>
        </section>

        <section className="space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted">
            One-click demo roles
          </span>
          {DEMO_ACCOUNTS.map((a) => (
            <button
              key={a.email}
              onClick={() => quickIn(a.role)}
              className="w-full text-left bg-card border border-border rounded-2xl p-5 hover:border-primary transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-accent">
                    {a.role}
                  </div>
                  <div className="font-display italic text-2xl mt-1">{a.name}</div>
                  <div className="text-[11px] font-mono text-muted mt-1">{a.email}</div>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted group-hover:text-primary">
                  Enter →
                </span>
              </div>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
}
