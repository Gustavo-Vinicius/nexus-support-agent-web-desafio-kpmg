import type { ChatMessage, ChatSessionSummary } from "@/lib/types";

function messagesKey(userId: string, sessionId: string) {
  return `nexus:${userId}:${sessionId}`;
}

function sessionsKey(userId: string) {
  return `nexus:sessions:${userId}`;
}

export function shortId(id: string) {
  return id.slice(0, 8);
}

export function loadMessages(
  userId: string,
  sessionId: string,
): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(messagesKey(userId, sessionId));
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as ChatMessage[];
  } catch {
    return [];
  }
}

export function saveMessages(
  userId: string,
  sessionId: string,
  messages: ChatMessage[],
) {
  try {
    sessionStorage.setItem(
      messagesKey(userId, sessionId),
      JSON.stringify(messages),
    );
  } catch {
    // ignore quota / private mode
  }
}

export function loadSessions(userId: string): ChatSessionSummary[] {
  try {
    const raw = sessionStorage.getItem(sessionsKey(userId));
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as ChatSessionSummary[];
  } catch {
    return [];
  }
}

export function saveSessions(userId: string, sessions: ChatSessionSummary[]) {
  try {
    sessionStorage.setItem(sessionsKey(userId), JSON.stringify(sessions));
  } catch {
    // ignore
  }
}

export function upsertSession(
  userId: string,
  session: ChatSessionSummary,
): ChatSessionSummary[] {
  const sessions = loadSessions(userId);
  const existing = sessions.find((item) => item.sessionId === session.sessionId);
  const lockedTitle =
    existing?.title && existing.title !== "Nova conversa"
      ? existing.title
      : session.title;

  const next = [
    {
      ...session,
      title: lockedTitle,
    },
    ...sessions.filter((item) => item.sessionId !== session.sessionId),
  ];
  saveSessions(userId, next);
  return next;
}

export function truncateTitle(text: string, max = 32) {
  const normalized = text.trim().replace(/\s+/g, " ");
  if (normalized.length <= max) {
    return normalized;
  }
  return `${normalized.slice(0, max - 1)}…`;
}

/** Remove histórico e entrada da lista local (try/catch). */
export function removeSession(
  userId: string,
  sessionId: string,
): ChatSessionSummary[] {
  try {
    sessionStorage.removeItem(messagesKey(userId, sessionId));
    const next = loadSessions(userId).filter(
      (session) => session.sessionId !== sessionId,
    );
    saveSessions(userId, next);
    return next;
  } catch {
    return loadSessions(userId);
  }
}

/** Remove todos os históricos e zera a lista local (try/catch). */
export function clearSessions(userId: string): ChatSessionSummary[] {
  try {
    const sessions = loadSessions(userId);
    for (const session of sessions) {
      sessionStorage.removeItem(messagesKey(userId, session.sessionId));
    }
    saveSessions(userId, []);
    return [];
  } catch {
    return loadSessions(userId);
  }
}
