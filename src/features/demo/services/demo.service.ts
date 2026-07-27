import { type Role, type User } from "@/features/auth/types/auth.types";

const ENABLE_DEMO_MODE = import.meta.env.VITE_ENABLE_DEMO_MODE === "true";

const DEMO_USERS: Record<Role, User> = {
  customer: {
    id: "demo-customer-id",
    email: "customer@nook.co",
    name: "Emily (Guest)",
    role: "customer",
  },
  staff: {
    id: "demo-staff-id",
    email: "staff@nook.co",
    name: "Sarah (Server)",
    role: "staff",
  },
  manager: {
    id: "demo-manager-id",
    email: "manager@nook.co",
    name: "Dipanshu (Manager)",
    role: "manager",
  },
  owner: {
    id: "demo-owner-id",
    email: "owner@nook.co",
    name: "AURA Owner",
    role: "owner",
  },
};

export const DemoService = {
  isDemoEnabled(): boolean {
    return ENABLE_DEMO_MODE;
  },

  async loginAsDemo(role: Role): Promise<User> {
    const user = DEMO_USERS[role];
    if (!user) throw new Error(`Invalid demo role: ${role}`);

    if (typeof window !== "undefined") {
      sessionStorage.setItem("smartserve.demo_user", JSON.stringify(user));
      sessionStorage.setItem("smartserve.is_demo_session", "true");
    }

    return user;
  },

  getDemoUser(): User | null {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("smartserve.demo_user");
      if (stored) {
        try {
          return JSON.parse(stored) as User;
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  isDemoSession(): boolean {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("smartserve.is_demo_session") === "true";
    }
    return false;
  },

  clearDemoSession() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("smartserve.demo_user");
      sessionStorage.removeItem("smartserve.is_demo_session");
    }
  }
};
