import { Plus, X } from "lucide-react";

import { AppIcon } from "@/components/AppIcon";
import { Button } from "@/components/Button";
import { userInitials } from "@/lib/mockUsers";
import type { ChatSessionSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

type SidebarProps = {
  userId: string;
  token: string;
  sessions: ChatSessionSummary[];
  activeSessionId: string;
  open?: boolean;
  onClose?: () => void;
  onNewConversation: () => void;
  onSelectSession: (sessionId: string) => void;
  onSwitchUser: () => void;
};

function formatTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Sidebar({
  userId,
  token,
  sessions,
  activeSessionId,
  open = true,
  onClose,
  onNewConversation,
  onSelectSession,
  onSwitchUser,
}: SidebarProps) {
  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-border bg-surface px-5 py-6 transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <AppIcon size={36} variant="light" />
            <div>
              <p className="text-sm font-semibold text-text">Nexus Commerce</p>
              <p className="text-xs text-text-muted">
                Assistente de atendimento
              </p>
            </div>
          </div>
          {onClose ? (
            <button
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-sm text-text-muted lg:hidden"
              onClick={onClose}
              aria-label="Fechar menu"
            >
              <X size={18} />
            </button>
          ) : null}
        </div>

        <Button className="mt-6 w-full" onClick={onNewConversation}>
          <Plus size={16} strokeWidth={2} aria-hidden="true" />
          Nova conversa
        </Button>

        <div className="mt-6 min-h-0 flex-1 overflow-y-auto">
          <p className="mb-2 text-[11px] font-medium tracking-wide text-text-muted uppercase">
            Conversas
          </p>
          <ul className="space-y-1">
            {sessions.length === 0 ? (
              <li className="px-3 py-2 text-xs text-text-muted">
                Nenhuma conversa ainda.
              </li>
            ) : (
              sessions.map((session) => {
                const active = session.sessionId === activeSessionId;
                return (
                  <li key={session.sessionId}>
                    <button
                      type="button"
                      onClick={() => onSelectSession(session.sessionId)}
                      className={cn(
                        "flex w-full flex-col rounded-sm px-3 py-2.5 text-left transition-colors",
                        active
                          ? "bg-primary-soft"
                          : "hover:bg-bg",
                      )}
                    >
                      <span
                        className={cn(
                          "truncate text-sm font-medium",
                          active ? "text-primary" : "text-text",
                        )}
                      >
                        {session.title}
                      </span>
                      <span className="text-xs text-text-muted">
                        {formatTime(session.updatedAt)}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>

        <div className="mt-auto rounded-[10px] bg-[#F2F4F7] p-3">
          <p className="text-[10px] font-medium tracking-wide text-text-muted uppercase">
            Usuário autenticado (mock)
          </p>
          <div className="mt-2 flex items-center gap-2.5">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
              {userInitials(userId)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-text">
                {userId}
              </p>
              <p className="truncate text-xs text-text-muted">
                Bearer {token}
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            className="mt-3 w-full"
            onClick={onSwitchUser}
          >
            Trocar usuário
          </Button>
        </div>
      </aside>
    </>
  );
}
