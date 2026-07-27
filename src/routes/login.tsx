import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth/components/LoginPage";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in · SmartServe" },
      { name: "description", content: "Sign in to SmartServe." },
      { property: "og:title", content: "SmartServe Sign In" },
      { property: "og:description", content: "Sign in to the SmartServe OS." },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({ next: typeof s.next === "string" ? s.next : "/" }),
  component: LoginRouteComponent,
});

function LoginRouteComponent() {
  const { next } = Route.useSearch();
  return <LoginPage next={next} />;
}
