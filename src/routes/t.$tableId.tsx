import { createFileRoute } from "@tanstack/react-router";
import { TableOrderPage } from "@/features/customer/pages/TableOrderPage";

export const Route = createFileRoute("/t/$tableId")({
  head: ({ params }) => ({
    meta: [
      { title: `Table ${params.tableId} · Order · SmartServe` },
      {
        name: "description",
        content:
          "Scan-to-order at your table. Live menu availability, instant kitchen sync, real-time order status.",
      },
      { property: "og:title", content: `SmartServe · Table ${params.tableId}` },
      {
        property: "og:description",
        content: "Order from your phone, watch it hit the kitchen live.",
      },
    ],
  }),
  component: TableOrderRouteComponent,
});

function TableOrderRouteComponent() {
  const { tableId } = Route.useParams();
  return <TableOrderPage tableId={tableId} />;
}
