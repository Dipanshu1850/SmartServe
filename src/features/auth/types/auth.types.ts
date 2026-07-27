export type Role = "customer" | "staff" | "manager" | "owner";

export type User = { email: string; name: string; role: Role; id: string };

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: Role;
  created_at: string;
  updated_at: string;
}

export type Permission =
  | "view_menu"
  | "reserve_table"
  | "track_orders"
  | "manage_profile"
  | "view_assigned_orders"
  | "update_order_status"
  | "manage_tables"
  | "view_reservations"
  | "receive_tasks"
  | "manage_operations"
  | "access_inventory"
  | "access_analytics"
  | "access_copilot"
  | "access_financial_reports"
  | "manage_users"
  | "manage_roles"
  | "full_access";

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  customer: [
    "view_menu",
    "reserve_table",
    "track_orders",
    "manage_profile",
  ],
  staff: [
    "view_assigned_orders",
    "update_order_status",
    "manage_tables",
    "view_reservations",
    "receive_tasks",
  ],
  manager: [
    "manage_operations",
    "access_inventory",
    "access_analytics",
    "access_copilot",
    "view_reservations",
    "manage_tables",
  ],
  owner: [
    "full_access",
  ],
};

export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false;
  if (user.role === "owner") return true;
  const permissions = ROLE_PERMISSIONS[user.role] || [];
  return permissions.includes(permission) || permissions.includes("full_access");
}

export const DEFAULT_DASHBOARDS: Record<Role, string> = {
  customer: "/customer",
  staff: "/staff",
  manager: "/manager",
  owner: "/owner",
};
