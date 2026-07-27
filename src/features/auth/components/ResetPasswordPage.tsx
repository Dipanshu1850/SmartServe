import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { AuthService } from "../services/auth.service";
import { toast } from "sonner";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

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
      await AuthService.updatePassword(password);
      toast.success("Password updated successfully!", {
        description: "You can now log in with your new password."
      });
      navigate({ to: "/login" as any });
    } catch (err: any) {
      setError(err.message || "An error occurred");
      toast.error("Password update failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="max-w-md mx-auto px-6 py-16">
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted">
              SmartServe · Recovery
            </span>
            <h1 className="font-display italic text-5xl leading-none">New password.</h1>
            <p className="text-sm text-muted">
              Choose a strong, secure password for your account.
            </p>
          </div>

          <form onSubmit={submit} className="bg-card border border-border rounded-2xl p-6 shadow-lg space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted">New Password</label>
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
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••"
                required
                className="mt-1 w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            {error && <p className="text-[11px] font-mono text-destructive text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-primary text-primary-foreground text-[11px] font-mono uppercase tracking-widest hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? "Updating..." : "Update Password →"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
