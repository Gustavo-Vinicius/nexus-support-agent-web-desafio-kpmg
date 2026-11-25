import { useEffect, useRef } from "react";

import { AssistantMessage } from "@/components/chat/AssistantMessage";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { UserMessage } from "@/components/chat/UserMessage";
import type { ChatMessage } from "@/lib/types";

const SUGGESTIONS = [
  "Qual é a política de devolução de eletrônicos?",
  "Qual o status do pedido 12345?",
  "Meu pedido está atrasado. O que posso fazer?",
  "Quero cancelar o pedido 12345.",
] as const;

type MessageListProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  onSuggestion: (text: string) => void;
  onConfirm: (value: boolean) => void;
  onRetry: () => void;
};

export function MessageList({
  messages,
  isLoading,
  onSuggestion,
  onConfirm,
  onRetry,
}: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-10">
        <div className="max-w-xl space-y-2 text-center">
          <h2 className="text-lg font-semibold text-text">
            Como posso ajudar?
          </h2>
          <p className="text-sm text-text-muted">
            Escolha um cenário ou faça uma pergunta sobre pedidos e políticas.
          </p>
        </div>
        <div className="grid w-full max-w-2xl gap-2 sm:grid-cols-2">
          {SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSuggestion(suggestion)}
              className="rounded-md border border-border bg-surface px-4 py-3 text-left text-sm text-text transition-colors hover:border-primary hover:bg-primary-soft"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      role="log"
      aria-live="polite"
      aria-relevant="additions"
      className="flex flex-1 flex-col gap-6 overflow-y-auto px-8 py-8 lg:px-12"
    >
      {messages.map((message) => {
        if (message.role === "user") {
          return <UserMessage key={message.id} content={message.content} />;
        }

        return (
          <AssistantMessage
            key={message.id}
            message={message}
            isError={message.role === "error"}
            onConfirm={onConfirm}
            onRetry={message.role === "error" ? onRetry : undefined}
            confirming={isLoading}
          />
        );
      })}

      {isLoading ? <TypingIndicator /> : null}
      <div ref={endRef} />
    </div>
  );
}
