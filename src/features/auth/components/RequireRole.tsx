import { useEffect, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";
import { type Role, DEFAULT_DASHBOARDS } from "../types/auth.types";

export function RequireRole({
  roles,
  children,
}: {
  roles: Role[];
  children: ReactNode;
}) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate({ to: "/login", search: { next: pathname } as never });
    } else if (!roles.includes(user.role)) {
      const dest = DEFAULT_DASHBOARDS[user.role] || "/login";
      navigate({ to: dest as never });
    }
  }, [user, loading, roles, navigate, pathname]);

  if (loading || !user || !roles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted">
          Checking credentials…
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
