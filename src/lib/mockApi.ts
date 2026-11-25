import type {
  ChatRequest,
  ChatSuccessResponse,
  Citation,
  Order,
  PendingAction,
  ToolCall,
} from "@/lib/types";

type MockSessionContext = {
  lastOrder?: Order;
};

const sessionContext = new Map<string, MockSessionContext>();

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomLatency() {
  return 600 + Math.floor(Math.random() * 600);
}

function correlationId() {
  return `corr-${crypto.randomUUID().slice(0, 8)}`;
}

function getContext(sessionId: string): MockSessionContext {
  const existing = sessionContext.get(sessionId);
  if (existing) {
    return existing;
  }
  const created: MockSessionContext = {};
  sessionContext.set(sessionId, created);
  return created;
}

function ok(partial: {
  reply: string;
  citations?: Citation[];
  toolCalls?: ToolCall[];
  order?: Order;
  pendingAction?: PendingAction;
  correlationId?: string;
}): ChatSuccessResponse {
  return {
    reply: partial.reply,
    citations: partial.citations ?? [],
    toolCalls: partial.toolCalls ?? [],
    order: partial.order,
    pendingAction: partial.pendingAction,
    correlationId: partial.correlationId ?? correlationId(),
  };
}

export class MockApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: {
      error: string;
      message: string;
      correlationId: string;
    },
  ) {
    super(body.message);
    this.name = "MockApiError";
  }
}

/**
 * Cliente mock com a mesma assinatura do POST /chat real.
 * Identidade vem do token (Bearer), nunca do corpo.
 */
export async function mockChat(
  token: string,
  body: ChatRequest,
): Promise<ChatSuccessResponse> {
  await delay(randomLatency());

  const ctx = getContext(body.sessionId);
  const isCustomer001 = token === "token-001";
  const isCustomer002 = token === "token-002";

  if (body.confirm === true) {
    return ok({
      reply: "Solicitação registrada. Protocolo CAN-2026-0042.",
      toolCalls: [
        {
          name: "confirm_cancellation",
          latencyMs: 180,
          status: "ok",
        },
      ],
    });
  }

  if (body.confirm === false) {
    return ok({
      reply: "Tudo certo, o pedido 12345 foi mantido.",
    });
  }

  const message = (body.message ?? "").toLowerCase();

  if (message.includes("erro503")) {
    throw new MockApiError(503, {
      error: "LLM_UNAVAILABLE",
      message: "O modelo de linguagem está temporariamente indisponível.",
      correlationId: correlationId(),
    });
  }

  if (message.includes("devolução") || message.includes("devolucao")) {
    return ok({
      reply:
        "Para eletrônicos, a devolução pode ser solicitada em até 7 dias corridos após o recebimento, desde que o produto esteja lacrado e com a nota fiscal. Após a aprovação, o reembolso é processado em até 10 dias úteis.",
      citations: [{ source: "devolucao.md", section: "Eletrônicos" }],
      toolCalls: [
        { name: "search_knowledge", latencyMs: 240, status: "ok" },
      ],
    });
  }

  if (message.includes("cancelar")) {
    const orderId = "12345";
    return ok({
      reply:
        "Encontrei o pedido e ele ainda está dentro do prazo para cancelamento. Confirme se deseja seguir com a solicitação.",
      citations: [{ source: "cancelamento.md", section: "Condições" }],
      toolCalls: [
        { name: "request_cancellation", latencyMs: 210, status: "pending" },
      ],
      pendingAction: { type: "confirm_cancellation", orderId },
    });
  }

  if (
    message.includes("previsão") ||
    message.includes("previsao") ||
    message.includes("entrega dele")
  ) {
    const order = ctx.lastOrder;
    if (!order) {
      return ok({
        reply:
          "Não encontrei um pedido recente nesta conversa para informar a previsão de entrega. Pode me passar o número do pedido?",
        toolCalls: [
          { name: "search_knowledge", latencyMs: 160, status: "ok" },
        ],
      });
    }

    const date = new Date(order.estimatedDelivery).toLocaleDateString("pt-BR");
    return ok({
      reply: `A previsão de entrega do pedido #${order.id} é ${date}.`,
      order,
      toolCalls: [{ name: "get_order", latencyMs: 190, status: "ok" }],
    });
  }

  if (message.includes("22222")) {
    if (isCustomer001) {
      return ok({
        reply:
          "Não encontrei o pedido 22222 entre os seus pedidos. Verifique o número ou tente outro pedido vinculado à sua conta.",
        toolCalls: [{ name: "get_order", latencyMs: 170, status: "error" }],
      });
    }

    if (isCustomer002) {
      const order: Order = {
        id: "22222",
        status: "shipped",
        estimatedDelivery: "2026-04-02",
        total: 189.9,
        canCancel: false,
      };
      ctx.lastOrder = order;
      return ok({
        reply: "O pedido #22222 foi enviado e está a caminho.",
        order,
        toolCalls: [{ name: "get_order", latencyMs: 200, status: "ok" }],
      });
    }
  }

  if (message.includes("status") || message.includes("12345")) {
    if (isCustomer002) {
      return ok({
        reply:
          "Não encontrei o pedido 12345 entre os seus pedidos. Confira o número e tente novamente.",
        toolCalls: [{ name: "get_order", latencyMs: 175, status: "error" }],
      });
    }

    const order: Order = {
      id: "12345",
      status: "delayed",
      estimatedDelivery: "2026-03-28",
      total: 349.9,
      canCancel: true,
    };
    ctx.lastOrder = order;

    return ok({
      reply:
        "O pedido #12345 está atrasado em relação à previsão original. Você ainda pode solicitar o cancelamento enquanto o status permitir.",
      order,
      toolCalls: [{ name: "get_order", latencyMs: 220, status: "ok" }],
    });
  }

  if (message.includes("atrasado")) {
    return ok({
      reply:
        "Quando um pedido atrasa, você pode acompanhar a nova previsão, abrir uma reclamação de entrega ou solicitar cancelamento se ainda estiver elegível. Quer que eu consulte um pedido específico?",
      citations: [{ source: "entregas.md", section: "Atrasos" }],
      toolCalls: [
        { name: "search_knowledge", latencyMs: 200, status: "ok" },
      ],
    });
  }

  return ok({
    reply: "Não encontrei essa informação nas políticas disponíveis.",
    toolCalls: [{ name: "search_knowledge", latencyMs: 150, status: "ok" }],
  });
}
