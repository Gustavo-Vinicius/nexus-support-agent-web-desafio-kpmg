import { ApiError } from "./api-error";

const DEFAULT_MESSAGES: Record<number, string> = {
  400: "Requisição inválida.",
  401: "Não autenticado.",
  403: "Você não possui permissão para executar esta ação.",
  404: "Recurso não encontrado.",
  405: "Método não permitido.",
  406: "Não foi possível processar a requisição.",
  408: "Tempo de requisição excedido.",
  409: "Conflito de dados.",
  415: "Tipo de conteúdo não suportado.",
  422: "Dados inválidos.",
  429: "Muitas requisições. Tente novamente mais tarde.",
  500: "Erro interno do servidor.",
  502: "Servidor indisponível.",
  503: "Serviço indisponível.",
  504: "Tempo de resposta do servidor excedido.",
};

function getApiErrorMessage(body: unknown): string | undefined {
  if (!body || typeof body !== "object") {
    return undefined;
  }

  const data = body as Record<string, unknown>;

  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }

  if (typeof data.error === "string" && data.error.trim()) {
    return data.error;
  }

  if (typeof data.detail === "string" && data.detail.trim()) {
    return data.detail;
  }

  if (typeof data.title === "string" && data.title.trim()) {
    return data.title;
  }

  if (Array.isArray(data.errors)) {
    const messages = data.errors.filter(
      (error): error is string => typeof error === "string",
    );

    if (messages.length > 0) {
      return messages.join(" ");
    }
  }

  if (
    data.errors &&
    typeof data.errors === "object" &&
    !Array.isArray(data.errors)
  ) {
    const validationMessages = Object.values(
      data.errors as Record<string, unknown>,
    ).flatMap((value) => {
      if (Array.isArray(value)) {
        return value.filter((item): item is string => typeof item === "string");
      }

      if (typeof value === "string") {
        return [value];
      }

      return [];
    });

    if (validationMessages.length > 0) {
      return validationMessages.join(" ");
    }
  }

  return undefined;
}

export async function handleApiError(response: Response): Promise<never> {
  let body: unknown;

  try {
    body = await response.json();
  } catch {
    body = undefined;
  }

  const message =
    getApiErrorMessage(body) ??
    DEFAULT_MESSAGES[response.status] ??
    "Ocorreu um erro inesperado.";

  throw new ApiError(response.status, message, body);
}
