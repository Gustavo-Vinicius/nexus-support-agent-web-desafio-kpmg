import type { Order } from "@/lib/types";

export const MOCK_ORDERS: Order[] = [
  {
    id: "12345",
    status: "delayed",
    estimatedDelivery: "2026-11-25",
    total: 299.9,
    canCancel: true,
  },
  {
    id: "22222",
    status: "shipped",
    estimatedDelivery: "2026-04-02",
    total: 189.9,
    canCancel: false,
  },
];

export function getMockOrder(id: string): Order | undefined {
  const order = MOCK_ORDERS.find((item) => item.id === id);
  return order ? { ...order } : undefined;
}
