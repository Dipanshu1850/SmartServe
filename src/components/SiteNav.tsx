import { Link, useRouterState } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Landing" },
  { to: "/diner", label: "Diner" },
  { to: "/reserve", label: "Reserve" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/admin", label: "Admin" },
] as const;

export function SiteNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-display text-xl italic tracking-tight">
            SmartServe
          </Link>
          <div className="hidden md:flex gap-6">
            {links.map((l) => {
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
          <button className="hidden sm:inline-flex px-4 py-2 text-[10px] font-mono border border-border rounded-full hover:bg-foreground/5 transition-colors uppercase tracking-widest">
            Restaurant Login
          </button>
          <button className="px-4 py-2 text-[10px] font-mono bg-foreground text-background rounded-full uppercase tracking-widest">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}
