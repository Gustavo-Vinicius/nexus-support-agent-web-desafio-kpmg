import { Chip } from "@/components/chat/Chip";
import type { Order, OrderStatus } from "@/lib/types";

const STATUS_MAP: Record<
  OrderStatus,
  { label: string; variant: "warning" | "tool" | "success" | "danger" }
> = {
  delayed: { label: "Atrasado", variant: "warning" },
  shipped: { label: "Enviado", variant: "tool" },
  delivered: { label: "Entregue", variant: "success" },
  canceled: { label: "Cancelado", variant: "danger" },
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("pt-BR");
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

type OrderCardProps = {
  order: Order;
};

export function OrderCard({ order }: OrderCardProps) {
  const status = STATUS_MAP[order.status];

  return (
    <div className="mt-3 rounded-md border border-border bg-bg p-3.5 px-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-text">Pedido #{order.id}</p>
        <Chip variant={status.variant}>{status.label}</Chip>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <p className="text-xs text-text-muted">Previsão de entrega</p>
          <p className="text-sm font-medium text-text">
            {formatDate(order.estimatedDelivery)}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Total</p>
          <p className="text-sm font-medium text-text">
            {formatCurrency(order.total)}
          </p>
        </div>
        <div>
          <p className="text-xs text-text-muted">Cancelável</p>
          <p className="text-sm font-medium text-text">
            {order.canCancel ? "Sim" : "Não"}
          </p>
        </div>
      </div>
    </div>
  );
}
