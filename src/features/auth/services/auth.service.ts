import { supabase } from "@/lib/supabase";
import { type Role, type Profile } from "../types/auth.types";

export const ProfileService = {
  async getProfile(id: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    return data as Profile;
  },

  async createProfile(profile: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .insert(profile)
      .select()
      .single();
    if (error) {
      console.error("Error creating profile:", error);
      throw error;
    }
    return data as Profile;
  },

  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
    return data as Profile;
  }
};

export const RoleService = {
  async getUserRole(userId: string): Promise<Role | null> {
    const profile = await ProfileService.getProfile(userId);
    return profile ? profile.role : null;
  },

  async updateUserRole(userId: string, role: Role): Promise<boolean> {
    try {
      await ProfileService.updateProfile(userId, { role });
      return true;
    } catch {
      return false;
    }
  }
};

export const AuthService = {
  async signUp(email: string, password: string, fullName: string, phone?: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || "",
        }
      }
    });

    if (error) throw error;
    if (!data.user) throw new Error("Registration failed");

    try {
      await ProfileService.createProfile({
        id: data.user.id,
        email: data.user.email || email,
        full_name: fullName,
        phone: phone || null,
        role: "customer", // Default role
      });
    } catch (e) {
      console.warn("Could not create profile client-side (may already exist via trigger):", e);
    }

    return data.user;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  },

  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/login",
      }
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async sendPasswordResetEmail(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    if (error) throw error;
  },

  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({
      password
    });
    if (error) throw error;
  }
};

export const AuditService = {
  async logLogin(userId: string, email: string) {
    let ipAddress = "unknown";
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      ipAddress = data.ip || "unknown";
    } catch (e) {
      console.warn("Could not fetch client IP address:", e);
    }

    const { error } = await supabase.from("login_logs").insert({
      user_id: userId,
      email: email,
      user_agent: typeof window !== "undefined" ? window.navigator.userAgent : "SSR",
      ip_address: ipAddress,
    });

    if (error) {
      console.error("Failed to insert login audit log:", error);
    }
  }
};
