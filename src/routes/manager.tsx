import { createFileRoute } from "@tanstack/react-router";
import { RequireRole } from "@/features/auth/components/RequireRole";
import { DashboardPage } from "@/features/manager/pages/DashboardPage";

export const Route = createFileRoute("/manager")({
  head: () => ({
    meta: [
      { title: "Manager Dashboard · SmartServe" },
      { name: "description", content: "SmartServe Manager Ops Dashboard" },
    ],
  }),
  component: () => (
    <RequireRole roles={["manager", "owner"]}>
      <DashboardPage />
    </RequireRole>
  ),
});
