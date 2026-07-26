import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";

export type Role = "diner" | "server" | "manager" | "admin";

export type User = { email: string; name: string; role: Role };

type AuthCtx = {
  user: User | null;
  signIn: (u: User) => void;
  signOut: () => void;
};

const KEY = "smartserve.session";
const Ctx = createContext<AuthCtx>({ user: null, signIn: () => {}, signOut: () => {} });

export const DEMO_ACCOUNTS: User[] = [
  { email: "diner@nook.co", name: "Ava (Guest)", role: "diner" },
  { email: "server@nook.co", name: "Marco (Server)", role: "server" },
  { email: "manager@nook.co", name: "Priya (Manager)", role: "manager" },
  { email: "admin@smartserve.io", name: "Root (Super Admin)", role: "admin" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
  }, []);

  const signIn = useCallback((u: User) => {
    setUser(u);
    try {
      localStorage.setItem(KEY, JSON.stringify(u));
    } catch {}
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(KEY);
    } catch {}
  }, []);

  return <Ctx.Provider value={{ user, signIn, signOut }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}

/** Client-side role guard. Redirects to /login if unauthorized. */
export function RequireRole({
  roles,
  children,
}: {
  roles: Role[];
  children: ReactNode;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!user) {
      navigate({ to: "/login", search: { next: pathname } as never });
    } else if (!roles.includes(user.role)) {
      navigate({ to: "/login", search: { next: pathname } as never });
    }
  }, [user, roles, navigate, pathname]);

  if (!user || !roles.includes(user.role)) {
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
