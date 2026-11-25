import { StorageKey } from "@/enum/storage-key.enum";

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; Max-Age=0; SameSite=Lax`;
}

/** Persiste identidade mock: sessionStorage (UI) + cookie (proxy HTTP). */
export function persistAuthSession(input: {
  token: string;
  userId: string;
  sessionId: string;
}) {
  try {
    sessionStorage.setItem(StorageKey.ACCESS_TOKEN, input.token);
    sessionStorage.setItem(StorageKey.USER_ID, input.userId);
    sessionStorage.setItem(StorageKey.SESSION_ID, input.sessionId);
  } catch {
    // ignore
  }

  setCookie(StorageKey.ACCESS_TOKEN, input.token);
}

export function clearAuthSession() {
  try {
    sessionStorage.removeItem(StorageKey.ACCESS_TOKEN);
    sessionStorage.removeItem(StorageKey.USER_ID);
    sessionStorage.removeItem(StorageKey.SESSION_ID);
  } catch {
    // ignore
  }

  clearCookie(StorageKey.ACCESS_TOKEN);
}

export function persistSessionId(sessionId: string) {
  try {
    sessionStorage.setItem(StorageKey.SESSION_ID, sessionId);
  } catch {
    // ignore
  }
}
