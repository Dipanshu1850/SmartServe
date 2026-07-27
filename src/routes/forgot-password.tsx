import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "@/features/auth/components/ForgotPasswordPage";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password · SmartServe" },
      { name: "description", content: "Reset your password." },
    ],
  }),
  component: ForgotPasswordRouteComponent,
});

function ForgotPasswordRouteComponent() {
  return <ForgotPasswordPage />;
}
