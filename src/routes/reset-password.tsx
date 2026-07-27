import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/features/auth/components/ResetPasswordPage";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset Password · SmartServe" },
      { name: "description", content: "Enter your new password." },
    ],
  }),
  component: ResetPasswordRouteComponent,
});

function ResetPasswordRouteComponent() {
  return <ResetPasswordPage />;
}
