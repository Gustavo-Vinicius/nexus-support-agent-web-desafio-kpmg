import { Menu } from "lucide-react";

import { Chip } from "@/components/chat/Chip";
import { shortId } from "@/lib/session-storage";

type ChatHeaderProps = {
  title: string;
  sessionId: string;
  userId: string;
  modelOnline: boolean;
  onOpenSidebar?: () => void;
};

export function ChatHeader({
  title,
  sessionId,
  userId,
  modelOnline,
  onOpenSidebar,
}: ChatHeaderProps) {
  const short = shortId(sessionId);

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-surface px-4 py-4 lg:px-8">
      <div className="flex min-w-0 items-start gap-3">
        {onOpenSidebar ? (
          <button
            type="button"
            onClick={onOpenSidebar}
            className="mt-0.5 inline-flex size-9 items-center justify-center rounded-sm border border-border bg-surface text-text lg:hidden"
            aria-label="Abrir menu de conversas"
          >
            <Menu size={18} strokeWidth={2} />
          </button>
        ) : null}
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-text">
            {title}
          </h1>
          <p className="truncate text-xs text-text-muted">
            Sessão {short} · thread {userId}:{short}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
        <Chip variant={modelOnline ? "success" : "danger"}>
          {modelOnline ? "Modelo online" : "Modelo indisponível"}
        </Chip>
      </div>
    </header>
  );
}
