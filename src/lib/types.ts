export type Citation = {
  source: string;
  section: string;
};

export type ToolCall = {
  name: string;
  latencyMs: number;
  status: "ok" | "error" | "pending";
};

export type OrderStatus = "delayed" | "shipped" | "delivered" | "canceled";

export type Order = {
  id: string;
  status: OrderStatus;
  estimatedDelivery: string;
  total: number;
  canCancel: boolean;
};

export type PendingAction = {
  type: "confirm_cancellation";
  orderId: string;
};

export type ChatSuccessResponse = {
  reply: string;
  citations: Citation[];
  toolCalls: ToolCall[];
  order?: Order;
  pendingAction?: PendingAction;
  correlationId: string;
};

export type ChatErrorResponse = {
  error: string;
  message: string;
  correlationId: string;
};

export type ChatRequest = {
  sessionId: string;
  message?: string;
  confirm?: boolean;
};

export type ChatMessageRole = "user" | "assistant" | "error";

export type ChatMessage = {
  id: string;
  role: ChatMessageRole;
  content: string;
  createdAt: string;
  citations?: Citation[];
  toolCalls?: ToolCall[];
  order?: Order;
  pendingAction?: PendingAction;
  confirmationResolved?: boolean | null;
  errorCode?: string;
  correlationId?: string;
};

export type ChatSessionSummary = {
  sessionId: string;
  title: string;
  updatedAt: string;
};
