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
    id: "12347",
    status: "shipped",
    estimatedDelivery: "2026-11-28",
    total: 928.9,
    canCancel: false,
    customerId: "customer-001",
  },
  {
    id: "12348",
    status: "processing",
    estimatedDelivery: "2026-12-03",
    total: 349.9,
    canCancel: true,
    customerId: "customer-001",
  },
  {
    id: "12349",
    status: "canceled",
    estimatedDelivery: "2026-10-20",
    total: 259.9,
    canCancel: false,
    customerId: "customer-001",
  },
  {
    id: "12350",
    status: "delivered",
    estimatedDelivery: "2026-11-21",
    total: 179.8,
    canCancel: false,
    customerId: "customer-001",
  },
  {
    id: "12351",
    status: "returned",
    estimatedDelivery: "2026-09-12",
    total: 1899.0,
    canCancel: false,
    customerId: "customer-001",
  },
  {
    id: "12352",
    status: "pending_payment",
    estimatedDelivery: "2026-12-10",
    total: 3899.0,
    canCancel: true,
    customerId: "customer-001",
  },
  {
    id: "12353",
    status: "delayed",
    estimatedDelivery: "2026-11-18",
    total: 499.9,
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
  {
    id: "22222",
    status: "shipped",
    estimatedDelivery: "2026-11-28",
    total: 1499.0,
    canCancel: false,
    customerId: "customer-002",
  },
  {
    id: "22223",
    status: "delayed",
    estimatedDelivery: "2026-11-20",
    total: 369.8,
    canCancel: true,
    customerId: "customer-002",
  },
  {
    id: "22224",
    status: "delivered",
    estimatedDelivery: "2026-11-02",
    total: 4299.0,
    canCancel: false,
    customerId: "customer-002",
  },
  {
    id: "22225",
    status: "shipped",
    estimatedDelivery: "2026-11-27",
    total: 463.7,
    canCancel: false,
    customerId: "customer-002",
  },
  {
    id: "22226",
    status: "delivered",
    estimatedDelivery: "2026-11-10",
    total: 239.7,
    canCancel: false,
    customerId: "customer-002",
  },
  {
    id: "22227",
    status: "canceled",
    estimatedDelivery: "2026-11-15",
    total: 599.9,
    canCancel: false,
    customerId: "customer-002",
  },
  {
    id: "22228",
    status: "pending_payment",
    estimatedDelivery: "2026-12-05",
    total: 189.9,
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
