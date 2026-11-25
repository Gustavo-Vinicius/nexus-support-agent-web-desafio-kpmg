import { AppIcon } from "@/components/AppIcon";

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3" aria-live="polite" aria-label="Assistente digitando">
      <AppIcon size={32} variant="primary" />
      <div className="rounded-lg rounded-tl-sm border border-border bg-surface px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:-0.2s]" />
          <span className="size-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:-0.1s]" />
          <span className="size-1.5 animate-bounce rounded-full bg-text-muted" />
        </div>
      </div>
    </div>
  );
}
