import { useState, useEffect, useCallback, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { ProfileService, AuthService } from "../services/auth.service";
import { type User, type Role } from "../types/auth.types";
import { DemoService } from "@/features/demo/services/demo.service";
import { Ctx } from "../hooks/useAuth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => DemoService.getDemoUser());
  const [loading, setLoading] = useState(() => !DemoService.getDemoUser());

  async function handleUserSession(supabaseUser: any) {
    let profile = await ProfileService.getProfile(supabaseUser.id);

    if (!profile) {
      const fullName = supabaseUser.user_metadata?.full_name || supabaseUser.email?.split("@")[0] || "User";
      const avatarUrl = supabaseUser.user_metadata?.avatar_url || null;
      try {
        profile = await ProfileService.createProfile({
          id: supabaseUser.id,
          email: supabaseUser.email || "",
          full_name: fullName,
          avatar_url: avatarUrl,
          role: "customer",
        });
      } catch (e) {
        console.error("Auto-profile creation failed:", e);
      }
    }

    if (profile) {
      setUser({
        email: profile.email,
        name: profile.full_name || "User",
        role: profile.role,
        id: profile.id,
      });

      if (typeof window !== "undefined" && !sessionStorage.getItem("smartserve.login_logged")) {
        sessionStorage.setItem("smartserve.login_logged", "true");
        import("../services/auth.service").then(({ AuditService }) => {
          AuditService.logLogin(supabaseUser.id, supabaseUser.email || "");
        });
      }
    } else {
      setUser({
        email: supabaseUser.email || "",
        name: supabaseUser.user_metadata?.full_name || "User",
        role: "customer",
        id: supabaseUser.id,
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    // If demo session is already loaded, bypass supabase session query
    if (DemoService.isDemoSession()) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        handleUserSession(session.user);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (DemoService.isDemoSession()) return;

      if (session?.user) {
        if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
          setLoading(true);
        }
        await handleUserSession(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInAsDemo = useCallback(async (role: Role) => {
    const demoUser = await DemoService.loginAsDemo(role);
    setUser(demoUser);
    setLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("smartserve.login_logged");
    }
    DemoService.clearDemoSession();
    try {
      await AuthService.signOut();
    } catch (e) {
      console.warn("Supabase signOut error:", e);
    }
    setUser(null);
  }, []);

  return (
    <Ctx.Provider value={{ user, loading, signOut, signInAsDemo }}>
      {children}
    </Ctx.Provider>
  );
}
