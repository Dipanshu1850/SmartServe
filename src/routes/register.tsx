import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "@/features/auth/components/RegisterPage";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register · SmartServe" },
      { name: "description", content: "Create an account with SmartServe." },
    ],
  }),
  component: RegisterRouteComponent,
});

function RegisterRouteComponent() {
  return <RegisterPage />;
}
