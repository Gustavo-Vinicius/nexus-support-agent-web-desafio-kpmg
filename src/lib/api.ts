import { StorageKey } from "@/enum/storage-key.enum";
import { MockApiError, mockChat } from "@/lib/mockApi";
import type {
  ChatErrorResponse,
  ChatRequest,
  ChatSuccessResponse,
} from "@/lib/types";

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

/**
 * Helper HTTP: identidade via Authorization Bearer do token salvo.
 * O userId nunca deve ir no corpo como fonte de identidade.
 */
export async function apiFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = getStoredToken();
  const headers = new Headers(init.headers);

  headers.set("Accept", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const baseUrl = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return fetch(`${baseUrl}${normalizedPath}`, {
    ...init,
    headers,
  });
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

export async function postChat(
  body: ChatRequest,
  token = getStoredToken(),
): Promise<ChatSuccessResponse> {
  if (!token) {
    throw new ChatApiError(401, "UNAUTHORIZED", "Não autenticado.", "local");
  }

  if (isMockEnabled()) {
    try {
      return await mockChat(token, body);
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

  let response: Response;

  try {
    response = await apiFetch("/chat", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new ChatApiError(
      0,
      "NETWORK_ERROR",
      "Falha de rede ao contatar o serviço.",
      "local",
    );
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    payload = undefined;
  }

  if (!response.ok) {
    const errorBody = payload as ChatErrorResponse | undefined;
    throw new ChatApiError(
      response.status,
      errorBody?.error ??
        (response.status === 503 ? "LLM_UNAVAILABLE" : "REQUEST_FAILED"),
      errorBody?.message ?? "Não foi possível obter resposta do assistente.",
      errorBody?.correlationId ?? "unknown",
    );
  }

  return payload as ChatSuccessResponse;
}
