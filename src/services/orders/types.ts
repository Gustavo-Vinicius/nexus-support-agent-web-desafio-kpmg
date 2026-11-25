export type ApiOrderStatus =
  | "processing"
  | "shipped"
  | "delayed"
  | "delivered"
  | "cancelled";

export type ApiOrderItem = {
  sku: string;
  name: string;
  qty: number;
};

/** Resposta de GET /orders/:id */
export type ApiOrder = {
  id: string;
  customerId: string;
  status: ApiOrderStatus;
  estimatedDelivery: string;
  total: number;
  canCancel: boolean;
  items?: ApiOrderItem[];
  cancellationRequestedAt?: string;
};

/** Resposta de POST /orders/:id/cancellation-request */
export type ApiCancellationResult = {
  orderId: string;
  status: "cancelled";
  recordedAt: string;
};
