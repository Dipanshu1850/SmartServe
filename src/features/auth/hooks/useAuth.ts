import { createContext, useContext, useCallback } from "react";
import { type User, type Role, type Permission, hasPermission } from "../types/auth.types";

export type AuthCtx = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInAsDemo: (role: Role) => Promise<void>;
};

export const Ctx = createContext<AuthCtx>({
  user: null,
  loading: true,
  signOut: async () => {},
  signInAsDemo: async () => {},
});

export function useAuth() {
  const context = useContext(Ctx);
  const checkPermission = useCallback(
    (permission: Permission) => hasPermission(context.user, permission),
    [context.user]
  );

  return {
    ...context,
    hasPermission: checkPermission,
  };
}
