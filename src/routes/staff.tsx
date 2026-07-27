import { createFileRoute } from "@tanstack/react-router";
import { RequireRole } from "@/features/auth/components/RequireRole";
import { StaffPortalPage } from "@/features/staff/pages/StaffPortalPage";

export const Route = createFileRoute("/staff")({
  head: () => ({
    meta: [
      { title: "Staff Portal · SmartServe" },
      {
        name: "description",
        content: "Staff operations portal with live tickets, tables floor map, and task checklist.",
      },
      { property: "og:title", content: "SmartServe Staff Portal" },
      { property: "og:description", content: "The pass, digitized. Bump, recall, expedite." },
    ],
  }),
  component: () => (
    <RequireRole roles={["staff"]}>
      <StaffPortalPage />
    </RequireRole>
  ),
});
