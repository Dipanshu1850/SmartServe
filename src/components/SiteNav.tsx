import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { type Role } from "@/features/auth/types/auth.types";

const links = [
  { to: "/", label: "Landing", roles: null },
  { to: "/customer", label: "Customer Portal", roles: ["customer"] as Role[] },
  { to: "/reserve", label: "Reserve", roles: null },
  { to: "/staff", label: "Staff Portal", roles: ["staff"] as Role[] },
  { to: "/manager", label: "Manager Dashboard", roles: ["manager", "owner"] as Role[] },
  { to: "/owner", label: "Owner Dashboard", roles: ["owner"] as Role[] },
] as const;

export function SiteNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-display text-xl italic tracking-tight">
            SmartServe
          </Link>
          <div className="hidden md:flex gap-6">
            {links.map((l) => {
              if (l.roles && (!user || !l.roles.includes(user.role))) return null;
              const active = l.to === "/" ? pathname === "/" : pathname.startsWith(l.to);
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={
                    "text-sm font-medium transition-colors " +
                    (active ? "text-primary" : "text-muted hover:text-foreground")
                  }
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-[11px] font-medium">{user.name}</span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-muted">
                  {user.role}
                </span>
              </div>
              <button
                onClick={() => {
                  signOut();
                  navigate({ to: "/" });
                }}
                className="px-4 py-2 text-[10px] font-mono border border-border rounded-full hover:bg-foreground/5 transition-colors uppercase tracking-widest"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                search={{ next: "/" }}
                className="hidden sm:inline-flex px-4 py-2 text-[10px] font-mono border border-border rounded-full hover:bg-foreground/5 transition-colors uppercase tracking-widest"
              >
                Sign in
              </Link>
              <Link
                to="/login"
                search={{ next: "/" }}
                className="px-4 py-2 text-[10px] font-mono bg-foreground text-background rounded-full uppercase tracking-widest"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
