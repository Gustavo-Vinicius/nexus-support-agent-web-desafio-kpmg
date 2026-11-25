"use client";

import { useCallback, useState } from "react";

import {
  clearSessions,
  loadSessions,
  removeSession,
} from "@/lib/session-storage";
import type { ChatSessionSummary } from "@/lib/types";
import { deleteSession } from "@/services/sessions/session.delete.service";

const SERVER_DELETE_WARNING =
  "O histórico do servidor não pôde ser apagado.";

export function useSessions(userId: string) {
  const [list, setList] = useState<ChatSessionSummary[]>(() =>
    loadSessions(userId),
  );
  const [serverWarning, setServerWarning] = useState<string | null>(null);

  const replace = useCallback((sessions: ChatSessionSummary[]) => {
    setList(sessions);
  }, []);

  const dismissWarning = useCallback(() => {
    setServerWarning(null);
  }, []);

  const remove = useCallback(
    async (sessionId: string) => {
      const next = removeSession(userId, sessionId);
      setList(next);
      setServerWarning(null);

      try {
        await deleteSession(sessionId);
      } catch {
        setServerWarning(SERVER_DELETE_WARNING);
      }
    },
    [userId],
  );

  const clear = useCallback(async () => {
    const previous = loadSessions(userId);
    const next = clearSessions(userId);
    setList(next);
    setServerWarning(null);

    const failures = await Promise.all(
      previous.map(async (session) => {
        try {
          await deleteSession(session.sessionId);
          return false;
        } catch {
          return true;
        }
      }),
    );

    if (failures.some(Boolean)) {
      setServerWarning(SERVER_DELETE_WARNING);
    }
  }, [userId]);

  return {
    list,
    remove,
    clear,
    replace,
    serverWarning,
    dismissWarning,
  };
}
