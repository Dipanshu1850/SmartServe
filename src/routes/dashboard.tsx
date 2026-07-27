import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const Route = createFileRoute("/dashboard")({
  component: DashboardRedirectComponent,
});

function DashboardRedirectComponent() {
  const { user } = useAuth();
  if (user?.role === "owner") {
    return <Navigate to="/owner" />;
  }
  return <Navigate to="/manager" />;
}
