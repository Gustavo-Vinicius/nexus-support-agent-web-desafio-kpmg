import { StorageKey } from "@/enum/storage-key.enum";
import { ApiError } from "@/errors/api-error";
import { MockApiError, mockChat } from "@/lib/mockApi";
import type {
  ChatErrorResponse,
  ChatRequest,
  ChatSuccessResponse,
  Order,
} from "@/lib/types";
import { postChatSend } from "@/services/chat/chat.send.service";
import type { ChatSendResponse } from "@/services/chat/types";
import { getOrderById } from "@/services/orders/order.get.service";
import type { ApiOrder } from "@/services/orders/types";

export function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "");

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL não configurada.");
  }

  return baseUrl;
}

export function isMockEnabled() {
  return process.env.NEXT_PUBLIC_USE_MOCK === "true";
}

export function getStoredToken(): string | null {
  try {
    return sessionStorage.getItem(StorageKey.ACCESS_TOKEN);
  } catch {
    return null;
  }
}

export function getStoredSessionId(): string | null {
  try {
    return sessionStorage.getItem(StorageKey.SESSION_ID);
  } catch {
    return null;
  }
}

export function getStoredUserId(): string | null {
  try {
    return sessionStorage.getItem(StorageKey.USER_ID);
  } catch {
    return null;
  }
}

export class ChatApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly error: string,
    message: string,
    public readonly correlationId: string,
  ) {
    super(message);
    this.name = "ChatApiError";
  }
}

function mapApiOrder(order: ApiOrder): Order {
  return {
    id: order.id,
    status: order.status,
    estimatedDelivery: order.estimatedDelivery,
    total: order.total,
    canCancel: order.canCancel,
    customerId: order.customerId,
  };
}

function extractOrderIds(text: string): string[] {
  const matches = text.matchAll(/\b(\d{4,})\b/g);
  return [...new Set([...matches].map((match) => match[1]))];
}

async function maybeLoadOrders(orderIds: string[]) {
  if (orderIds.length === 0) {
    return [] as Order[];
  }

  const results = await Promise.all(
    orderIds.map(async (orderId) => {
      try {
        return mapApiOrder(await getOrderById(orderId));
      } catch {
        return null;
      }
    }),
  );

  return results.filter((order): order is Order => order != null);
}

function mapChatSendResponse(
  data: ChatSendResponse,
  orders: Order[],
): ChatSuccessResponse {
  const pending = data.awaitingConfirmation
    ? {
        type: "confirm_cancellation" as const,
        orderId: data.awaitingConfirmation.orderId,
      }
    : undefined;

  return {
    reply: data.reply,
    threadId: data.threadId,
    correlationId: data.threadId,
    citations: [],
    toolCalls: pending
      ? [
          {
            name: "request_cancellation",
            latencyMs: 0,
            status: "pending",
          },
        ]
      : [],
    pendingAction: pending,
    orders,
  };
}

/**
 * Cliente unificado do chat.
 * Identidade via Bearer (cookie → proxy). O userId nunca vai no corpo.
 */
export async function postChat(
  body: ChatRequest,
  _token = getStoredToken(),
): Promise<ChatSuccessResponse> {
  if (isMockEnabled()) {
    try {
      return await mockChat(_token ?? "", body);
    } catch (error) {
      if (error instanceof MockApiError) {
        throw new ChatApiError(
          error.status,
          error.body.error,
          error.body.message,
          error.body.correlationId,
        );
      }
      throw new ChatApiError(
        0,
        "NETWORK_ERROR",
        "Falha de rede ao contatar o serviço.",
        "local",
      );
    }
  }

  const message =
    body.message ??
    (body.confirm === true ? "sim" : body.confirm === false ? "não" : "");

  if (!message.trim()) {
    throw new ChatApiError(
      400,
      "invalid_body",
      "Mensagem obrigatória para o chat.",
      "local",
    );
  }

  try {
    const data = await postChatSend({
      sessionId: body.sessionId,
      message,
    });

    const orderIds = [
      ...(data.awaitingConfirmation?.orderId
        ? [data.awaitingConfirmation.orderId]
        : []),
      ...extractOrderIds(data.reply),
    ];
    const orders = await maybeLoadOrders([...new Set(orderIds)]);

    return mapChatSendResponse(data, orders);
  } catch (error) {
    if (error instanceof ApiError) {
      const details = error.details as ChatErrorResponse | undefined;
      throw new ChatApiError(
        error.status,
        details?.error ??
          (error.status === 503 ? "llm_unavailable" : "REQUEST_FAILED"),
        error.message,
        details?.correlationId ?? "unknown",
      );
    }

    throw new ChatApiError(
      0,
      "NETWORK_ERROR",
      "Falha de rede ao contatar o serviço.",
      "local",
    );
  }
}
