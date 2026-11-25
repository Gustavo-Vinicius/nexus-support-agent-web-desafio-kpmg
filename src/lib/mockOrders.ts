import type { Order } from "@/lib/types";

/** Fixtures alinhadas a data/orders.json da API Nexus. */
export const MOCK_ORDERS: Order[] = [
  {
    id: "12345",
    status: "delayed",
    estimatedDelivery: "2026-11-25",
    total: 299.9,
    canCancel: true,
    customerId: "customer-001",
  },
  {
    id: "12346",
    status: "delivered",
    estimatedDelivery: "2026-02-15",
    total: 199.8,
    canCancel: false,
    customerId: "customer-001",
  },
  {
    id: "99999",
    status: "processing",
    estimatedDelivery: "2026-12-01",
    total: 459.0,
    canCancel: true,
    customerId: "customer-002",
  },
];

export function getMockOrder(id: string): Order | undefined {
  const order = MOCK_ORDERS.find((item) => item.id === id);
  return order ? { ...order } : undefined;
}

export function getMockOrdersByCustomer(customerId: string): Order[] {
  return MOCK_ORDERS.filter((item) => item.customerId === customerId).map(
    (item) => ({ ...item }),
  );
}
