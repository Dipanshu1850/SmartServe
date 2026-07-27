import { useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { AuthService, ProfileService } from "../services/auth.service";
import { type Role, DEFAULT_DASHBOARDS } from "../types/auth.types";
import { DemoService } from "@/features/demo/services/demo.service";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import {
  User,
  Users,
  TrendingUp,
  Shield,
  Sparkles,
} from "lucide-react";

const ROLE_ROUTES = DEFAULT_DASHBOARDS;

export function LoginPage({ next }: { next: string }) {
  const navigate = useNavigate();
  const { signInAsDemo } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);

  const showDemo = DemoService.isDemoEnabled();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await AuthService.signIn(email.trim(), password);
      const profile = await ProfileService.getProfile(user.id);
      const role = profile ? profile.role : "customer";

      const target = next && next !== "/" ? next : ROLE_ROUTES[role];
      toast.success(`Welcome back!`);
      navigate({ to: target as never });
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
      toast.error("Authentication failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      await AuthService.signInWithGoogle();
    } catch (err: any) {
      toast.error("Google login failed", { description: err.message });
    }
  }

  async function handleDemoExplore(role: Role) {
    setError(null);
    setDemoLoading(role);
    try {
      await signInAsDemo(role);
      const target = next && next !== "/" ? next : ROLE_ROUTES[role];
      toast.success(`Access granted: ${role} demo workspace`);
      navigate({ to: target as never });
    } catch (err: any) {
      toast.error("Demo access failed", { description: err.message });
    } finally {
      setDemoLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-foreground flex flex-col">
      <SiteNav />

      <main className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className={
          "w-full max-w-md " +
          (showDemo ? "lg:max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center" : "")
        }>

          {/* SECTION 1: Production Sign In */}
          <section className="space-y-6">
            <div className="text-center space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary/80">
                SmartServe · Access
              </span>
              <h1 className="font-display italic text-4xl md:text-5xl leading-none text-white">Sign in.</h1>
              <p className="text-xs text-muted-foreground">
                Access the intelligent restaurant operations system.
              </p>
            </div>

            <form onSubmit={submit} className="bg-[#121214] border border-[#1e1e24] rounded-2xl p-6 space-y-4 shadow-2xl">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your-email@example.com"
                  required
                  className="mt-1 w-full bg-background border border-[#1e1e24] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary placeholder:text-muted/40"
                />
              </div>
              <div>
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-[10px] font-mono text-primary hover:underline uppercase tracking-widest"
                  >
                    Forgot?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  required
                  className="mt-1 w-full bg-background border border-[#1e1e24] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary placeholder:text-muted/40"
                />
              </div>
              {error && <p className="text-[11px] font-mono text-destructive text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading || !!demoLoading}
                className="w-full py-3 rounded-full bg-primary text-primary-foreground text-[11px] font-mono uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
              >
                {loading ? "Signing in..." : "Sign in →"}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#1e1e24]"></div>
                <span className="flex-shrink mx-4 text-muted-foreground text-[10px] font-mono uppercase">Or</span>
                <div className="flex-grow border-t border-[#1e1e24]"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3 rounded-full border border-[#1e1e24] bg-transparent text-white text-[11px] font-mono uppercase tracking-widest hover:bg-white/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="size-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </button>
            </form>

            <p className="text-center text-xs text-muted-foreground">
              New to SmartServe?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Create an account
              </Link>
            </p>
          </section>

          {/* SECTION 2: Hackathon Explore AURA */}
          {showDemo && (
            <section className="space-y-6 mt-12 lg:mt-0">
              <div className="text-center lg:text-left space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#a1a1aa] flex items-center justify-center lg:justify-start gap-1">
                  <Sparkles className="size-3 text-primary animate-pulse" /> Sandbox
                </span>
                <h2 className="font-display italic text-4xl md:text-5xl leading-none text-white">Explore AURA.</h2>
                <p className="text-xs text-muted-foreground">
                  Experience the platform from different restaurant perspectives.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Customer Demo */}
                <div className="bg-[#121214] border border-[#1e1e24] p-5 rounded-2xl flex flex-col justify-between text-left group hover:border-primary/40 transition-colors">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-mono uppercase text-primary tracking-wider">Customer Experience</span>
                      <User className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Explore dining menus, reservations booking, cart orders, and real-time tracking logs.
                    </p>
                  </div>
                  <button
                    disabled={!!demoLoading || loading}
                    onClick={() => handleDemoExplore("customer")}
                    className="w-full mt-4 py-2 bg-foreground text-background text-[9px] font-mono uppercase tracking-widest rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer"
                  >
                    {demoLoading === "customer" ? "Accessing..." : "Explore as Customer →"}
                  </button>
                </div>

                {/* 2. Staff Demo */}
                <div className="bg-[#121214] border border-[#1e1e24] p-5 rounded-2xl flex flex-col justify-between text-left group hover:border-primary/40 transition-colors">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-mono uppercase text-primary tracking-wider">Restaurant Staff</span>
                      <Users className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Manage active ticket pipelines, table statuses, task lists, and service calls.
                    </p>
                  </div>
                  <button
                    disabled={!!demoLoading || loading}
                    onClick={() => handleDemoExplore("staff")}
                    className="w-full mt-4 py-2 bg-foreground text-background text-[9px] font-mono uppercase tracking-widest rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer"
                  >
                    {demoLoading === "staff" ? "Accessing..." : "Explore as Staff →"}
                  </button>
                </div>

                {/* 3. Manager Demo */}
                <div className="bg-[#121214] border border-[#1e1e24] p-5 rounded-2xl flex flex-col justify-between text-left group hover:border-primary/40 transition-colors">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-mono uppercase text-primary tracking-wider">Restaurant Manager</span>
                      <TrendingUp className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Monitor live operations, food inventory stock,Weekly Recharts analytics, and AI Copilot.
                    </p>
                  </div>
                  <button
                    disabled={!!demoLoading || loading}
                    onClick={() => handleDemoExplore("manager")}
                    className="w-full mt-4 py-2 bg-foreground text-background text-[9px] font-mono uppercase tracking-widest rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer"
                  >
                    {demoLoading === "manager" ? "Accessing..." : "Explore as Manager →"}
                  </button>
                </div>

                {/* 4. Owner Demo */}
                <div className="bg-[#121214] border border-[#1e1e24] p-5 rounded-2xl flex flex-col justify-between text-left group hover:border-primary/40 transition-colors">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[9px] font-mono uppercase text-primary tracking-wider">Restaurant Owner</span>
                      <Shield className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      View multi-branch MRR performance, server tickets, user profiles, and strategic AI advice.
                    </p>
                  </div>
                  <button
                    disabled={!!demoLoading || loading}
                    onClick={() => handleDemoExplore("owner")}
                    className="w-full mt-4 py-2 bg-foreground text-background text-[9px] font-mono uppercase tracking-widest rounded-lg hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer"
                  >
                    {demoLoading === "owner" ? "Accessing..." : "Explore as Owner →"}
                  </button>
                </div>
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}
