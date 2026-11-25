"use client";

import { useCallback, useState } from "react";

import { ChatApiError, postChat } from "@/lib/api";
import {
  loadMessages,
  loadSessions,
  saveMessages,
  truncateTitle,
  upsertSession,
} from "@/lib/session-storage";
import type { ChatMessage, ChatSessionSummary } from "@/lib/types";

function createMessage(
  partial: Omit<ChatMessage, "id" | "createdAt"> & {
    id?: string;
    createdAt?: string;
  },
): ChatMessage {
  return {
    id: partial.id ?? crypto.randomUUID(),
    createdAt: partial.createdAt ?? new Date().toISOString(),
    ...partial,
  };
}

type UseChatOptions = {
  userId: string;
  token: string;
  sessionId: string;
  onSessionsChange?: (sessions: ChatSessionSummary[]) => void;
  onModelAvailabilityChange?: (online: boolean) => void;
};

export function useChat({
  userId,
  token,
  sessionId,
  onSessionsChange,
  onModelAvailabilityChange,
}: UseChatOptions) {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadMessages(userId, sessionId),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);

  const persist = useCallback(
    (nextMessages: ChatMessage[]) => {
      saveMessages(userId, sessionId, nextMessages);

      const existing = loadSessions(userId).find(
        (session) => session.sessionId === sessionId,
      );
      const firstUser = nextMessages.find((message) => message.role === "user");
      const title =
        existing?.title && existing.title !== "Nova conversa"
          ? existing.title
          : truncateTitle(firstUser?.content ?? "Nova conversa");

      const sessions = upsertSession(userId, {
        sessionId,
        title,
        updatedAt: new Date().toISOString(),
      });
      onSessionsChange?.(sessions);
    },
    [onSessionsChange, sessionId, userId],
  );

  const send = useCallback(
    async (message: string, baseMessages?: ChatMessage[]) => {
      const trimmed = message.trim();
      if (!trimmed || isLoading) {
        return;
      }

      setIsLoading(true);
      setError(null);
      setLastUserMessage(trimmed);

      const userMessage = createMessage({
        role: "user",
        content: trimmed,
      });

      const history = baseMessages ?? messages;
      const withUser = [...history, userMessage];
      setMessages(withUser);
      persist(withUser);

      try {
        const response = await postChat(
          { sessionId, message: trimmed },
          token,
        );

        onModelAvailabilityChange?.(true);

        const assistantMessage = createMessage({
          role: "assistant",
          content: response.reply,
          citations: response.citations,
          toolCalls: response.toolCalls,
          order: response.order,
          pendingAction: response.pendingAction,
          confirmationResolved: response.pendingAction ? null : undefined,
          correlationId: response.correlationId,
        });

        const next = [...withUser, assistantMessage];
        setMessages(next);
        persist(next);
      } catch (err) {
        const apiError =
          err instanceof ChatApiError
            ? err
            : new ChatApiError(
                0,
                "NETWORK_ERROR",
                "Falha de rede ao contatar o serviço.",
                "local",
              );

        if (apiError.status === 503 || apiError.error === "LLM_UNAVAILABLE") {
          onModelAvailabilityChange?.(false);
        }

        const errorMessage = createMessage({
          role: "error",
          content: apiError.message,
          errorCode: apiError.error,
          correlationId: apiError.correlationId,
        });

        const next = [...withUser, errorMessage];
        setMessages(next);
        persist(next);
        setError(apiError.message);
      } finally {
        setIsLoading(false);
      }
    },
    [
      isLoading,
      messages,
      onModelAvailabilityChange,
      persist,
      sessionId,
      token,
    ],
  );

  const confirm = useCallback(
    async (value: boolean) => {
      if (isLoading) {
        return;
      }

      setIsLoading(true);
      setError(null);

      const marked = messages.map((message) => {
        if (message.pendingAction && message.confirmationResolved == null) {
          return { ...message, confirmationResolved: value };
        }
        return message;
      });
      setMessages(marked);
      persist(marked);

      try {
        const response = await postChat({ sessionId, confirm: value }, token);
        onModelAvailabilityChange?.(true);

        const assistantMessage = createMessage({
          role: "assistant",
          content: response.reply,
          citations: response.citations,
          toolCalls: response.toolCalls,
          correlationId: response.correlationId,
        });

        const next = [...marked, assistantMessage];
        setMessages(next);
        persist(next);
      } catch (err) {
        const apiError =
          err instanceof ChatApiError
            ? err
            : new ChatApiError(
                0,
                "NETWORK_ERROR",
                "Falha de rede ao contatar o serviço.",
                "local",
              );

        if (apiError.status === 503 || apiError.error === "LLM_UNAVAILABLE") {
          onModelAvailabilityChange?.(false);
        }

        const errorMessage = createMessage({
          role: "error",
          content: apiError.message,
          errorCode: apiError.error,
          correlationId: apiError.correlationId,
        });

        const next = [...marked, errorMessage];
        setMessages(next);
        persist(next);
        setError(apiError.message);
      } finally {
        setIsLoading(false);
      }
    },
    [
      isLoading,
      messages,
      onModelAvailabilityChange,
      persist,
      sessionId,
      token,
    ],
  );

  const retry = useCallback(async () => {
    if (!lastUserMessage || isLoading) {
      return;
    }

    const next = [...messages];
    const last = next[next.length - 1];
    if (last?.role === "error") {
      next.pop();
    }

    const maybeUser = next[next.length - 1];
    if (maybeUser?.role === "user" && maybeUser.content === lastUserMessage) {
      next.pop();
    }

    setMessages(next);
    await send(lastUserMessage, next);
  }, [isLoading, lastUserMessage, messages, send]);

  return {
    messages,
    isLoading,
    error,
    send,
    confirm,
    retry,
  };
}
