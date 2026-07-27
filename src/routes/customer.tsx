import { createFileRoute } from "@tanstack/react-router";
import { RequireRole } from "@/features/auth/components/RequireRole";
import { CustomerPortalPage } from "@/features/customer/pages/CustomerPortalPage";

export const Route = createFileRoute("/customer")({
  head: () => ({
    meta: [
      { title: "Customer Portal · SmartServe" },
      {
        name: "description",
        content:
          "Scan-to-order live menu with real-time availability, AI recommendations, and instant order tracking.",
      },
      { property: "og:title", content: "SmartServe Customer Portal" },
      {
        property: "og:description",
        content: "Live availability, AI recommendations, transparent ordering.",
      },
    ],
  }),
  component: () => (
    <RequireRole roles={["customer"]}>
      <CustomerPortalPage />
    </RequireRole>
  ),
});
