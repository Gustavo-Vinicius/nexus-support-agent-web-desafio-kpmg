import { AppIcon } from "@/components/AppIcon";
import { Button } from "@/components/Button";
import { Chip } from "@/components/chat/Chip";
import { ConfirmationCard } from "@/components/chat/ConfirmationCard";
import { OrderCard } from "@/components/chat/OrderCard";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

type AssistantMessageProps = {
  message: ChatMessage;
  isError?: boolean;
  onConfirm?: (value: boolean) => void;
  onRetry?: () => void;
  confirming?: boolean;
};

export function AssistantMessage({
  message,
  isError,
  onConfirm,
  onRetry,
  confirming,
}: AssistantMessageProps) {
  return (
    <div className="flex items-start gap-3">
      <AppIcon size={32} variant="light" />
      <div className="min-w-0 max-w-[620px] flex-1 space-y-2">
        <div
          className={cn(
            "rounded-lg rounded-tl-sm border px-4 py-3.5 text-sm leading-[150%] whitespace-pre-wrap text-text",
            isError
              ? "border-danger bg-danger-soft"
              : "border-border bg-surface",
          )}
        >
          {message.content}

          {message.order ? <OrderCard order={message.order} /> : null}

          {message.pendingAction ? (
            <ConfirmationCard
              action={message.pendingAction}
              resolved={message.confirmationResolved}
              disabled={confirming}
              onConfirm={() => onConfirm?.(true)}
              onKeep={() => onConfirm?.(false)}
            />
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {isError && message.errorCode ? (
            <Chip variant="danger">{message.errorCode}</Chip>
          ) : null}
          {isError && message.correlationId ? (
            <Chip variant="tool">{message.correlationId}</Chip>
          ) : null}
          {message.citations?.map((citation) => (
            <Chip
              key={`${citation.source}-${citation.section}`}
              variant="citation"
            >
              {citation.source} § {citation.section}
            </Chip>
          ))}
          {message.toolCalls?.map((tool) => (
            <Chip key={`${tool.name}-${tool.latencyMs}`} variant="tool">
              {tool.name} · {tool.latencyMs} ms
            </Chip>
          ))}
        </div>

        {isError && onRetry ? (
          <Button variant="secondary" className="w-auto" onClick={onRetry}>
            Tentar novamente
          </Button>
        ) : null}
      </div>
    </div>
  );
}
