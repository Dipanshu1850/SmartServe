import { useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { AuthService, ProfileService } from "../services/auth.service";
import { type Role, DEFAULT_DASHBOARDS } from "../types/auth.types";
import { toast } from "sonner";

const ROLE_ROUTES = DEFAULT_DASHBOARDS;

export function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError("Full Name is required");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("A valid Email is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const user = await AuthService.signUp(email.trim(), password, fullName.trim(), phone.trim() || undefined);
      const profile = await ProfileService.getProfile(user.id);
      const role = (profile?.role ?? "customer") as Role;
      const target = ROLE_ROUTES[role] ?? "/customer";

      toast.success("Account created successfully!", {
        description: `Redirecting to your ${role} workspace.`
      });
      navigate({ to: target as never });
    } catch (err: any) {
      setError(err.message || "An error occurred during registration");
      toast.error("Registration failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      await AuthService.signInWithGoogle();
    } catch (err: any) {
      toast.error("Google Sign-In failed", { description: err.message });
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="max-w-md mx-auto px-6 py-16">
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted">
              SmartServe · Onboarding
            </span>
            <h1 className="font-display italic text-5xl leading-none">Create account.</h1>
            <p className="text-sm text-muted">
              Join the intelligent restaurant operations system.
            </p>
          </div>

          <form onSubmit={submit} className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-lg">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Emily Johnson"
                required
                className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="customer@aura.ai"
                required
                className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Phone (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  required
                  className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Confirm</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••"
                  required
                  className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {error && <p className="text-[11px] font-mono text-destructive text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-primary text-primary-foreground text-[11px] font-mono uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? "Registering..." : "Register →"}
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-muted text-[10px] font-mono uppercase">Or</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 rounded-full border border-border bg-background text-foreground text-[11px] font-mono uppercase tracking-widest hover:bg-secondary transition-colors flex items-center justify-center gap-2"
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
              Sign up with Google
            </button>
          </form>

          <p className="text-center text-xs text-muted">
            Already have an account?{" "}
            <Link to="/login" search={{ next: "/" }} className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
