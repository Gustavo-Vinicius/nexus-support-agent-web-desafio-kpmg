import { Chip } from "@/components/chat/Chip";
import type { Order, OrderStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_MAP: Record<
  OrderStatus,
  { label: string; variant: "warning" | "tool" | "success" | "danger" }
> = {
  processing: { label: "Em processamento", variant: "tool" },
  delayed: { label: "Atrasado", variant: "warning" },
  shipped: { label: "Enviado", variant: "tool" },
  delivered: { label: "Entregue", variant: "success" },
  canceled: { label: "Cancelado", variant: "danger" },
  cancelled: { label: "Cancelado", variant: "danger" },
};

function formatDate(value: string) {
  const date = new Date(
    value.includes("T") ? value : `${value}T12:00:00`,
  );
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
  compact?: boolean;
};

export function OrderCard({ order, compact = false }: OrderCardProps) {
  const status = STATUS_MAP[order.status];

  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md border border-border bg-bg px-3 py-2.5">
        <p className="text-sm font-semibold text-text">#{order.id}</p>
        <Chip variant={status.variant}>{status.label}</Chip>
        <p className="text-sm text-text-muted">
          {formatDate(order.estimatedDelivery)}
        </p>
        <p className="ml-auto text-sm font-medium text-text">
          {formatCurrency(order.total)}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border bg-bg p-3.5 px-4">
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

type OrderCardsProps = {
  orders: Order[];
  className?: string;
};

export function OrderCards({ orders, className }: OrderCardsProps) {
  if (orders.length === 0) {
    return null;
  }

  const compact = orders.length > 2;

  return (
    <div className={cn("mt-3 flex flex-col gap-2", className)}>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} compact={compact} />
      ))}
    </div>
  );
}
