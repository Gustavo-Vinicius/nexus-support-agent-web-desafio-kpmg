import { StorageKey } from "@/enum/storage-key.enum";

export function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, "");

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL não configurada.");
  }

  return baseUrl;
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
