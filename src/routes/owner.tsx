import { createFileRoute } from "@tanstack/react-router";
import { RequireRole } from "@/features/auth/components/RequireRole";
import { OwnerDashboardPage } from "@/features/owner/pages/OwnerDashboardPage";

export const Route = createFileRoute("/owner")({
  head: () => ({
    meta: [
      { title: "Owner Dashboard · SmartServe" },
      { name: "description", content: "SmartServe Owner Executive Dashboard" },
    ],
  }),
  component: () => (
    <RequireRole roles={["owner"]}>
      <OwnerDashboardPage />
    </RequireRole>
  ),
});
