import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { AuthService } from "../services/auth.service";
import { toast } from "sonner";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !email.includes("@")) {
      setError("A valid Email is required");
      return;
    }

    setLoading(true);
    try {
      await AuthService.sendPasswordResetEmail(email.trim());
      setSubmitted(true);
      toast.success("Password reset email sent!");
    } catch (err: any) {
      setError(err.message || "An error occurred");
      toast.error("Failed to send reset email", { description: err.message });
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
            <h1 className="font-display italic text-5xl leading-none">Reset password.</h1>
            <p className="text-sm text-muted">
              We'll email you a secure link to reset your password.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
            {submitted ? (
              <div className="space-y-4 text-center">
                <div className="text-accent font-display italic text-2xl">✓ Email Sent</div>
                <p className="text-sm text-muted">
                  Check your inbox at <span className="text-foreground font-semibold">{email}</span> for instructions to reset your password.
                </p>
                <Link
                  to="/login"
                  search={{ next: "/" }}
                  className="mt-4 block w-full py-3 rounded-full bg-primary text-primary-foreground text-[11px] font-mono uppercase tracking-widest hover:opacity-90 transition-opacity text-center"
                >
                  Return to Sign In
                </Link>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-widest text-muted">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your-email@example.com"
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
                  {loading ? "Sending..." : "Send Reset Link →"}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-xs text-muted">
            Remember your password?{" "}
            <Link to="/login" search={{ next: "/" }} className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}
