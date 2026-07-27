import React from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { type Permission } from "@/features/auth/types/auth.types";

interface PermissionGuardProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { hasPermission } = useAuth();
  if (hasPermission(permission)) {
    return React.createElement(React.Fragment, null, children);
  }
  return React.createElement(React.Fragment, null, fallback);
}
