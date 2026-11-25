"use client";

import { Plus, Trash2, X } from "lucide-react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { AppIcon } from "@/components/AppIcon";
import { Button } from "@/components/Button";
import { userInitials } from "@/lib/mockUsers";
import type { ChatSessionSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

type ConfirmTarget = { type: "session"; sessionId: string } | { type: "all" };

type SidebarProps = {
  userId: string;
  token: string;
  sessions: ChatSessionSummary[];
  activeSessionId: string;
  open?: boolean;
  serverWarning?: string | null;
  onClose?: () => void;
  onNewConversation: () => void;
  onSelectSession: (sessionId: string) => void;
  onRemoveSession: (sessionId: string) => void | Promise<void>;
  onClearSessions: () => void | Promise<void>;
  onDismissWarning?: () => void;
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

function InlineDeleteConfirm({
  label = "Excluir esta conversa?",
  onConfirm,
  onCancel,
}: {
  label?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="rounded-sm bg-bg px-3 py-2.5">
      <p className="text-xs leading-none text-[#B42318]">{label}</p>
      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-sm bg-[#FEF3F2] px-2.5 py-1 text-xs font-medium text-[#B42318] transition-colors hover:bg-[#FEE4E2]"
        >
          Excluir
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-sm px-2.5 py-1 text-xs font-medium text-[#667085] transition-colors hover:bg-white"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export function Sidebar({
  userId,
  token,
  sessions,
  activeSessionId,
  open = true,
  serverWarning,
  onClose,
  onNewConversation,
  onSelectSession,
  onRemoveSession,
  onClearSessions,
  onDismissWarning,
  onSwitchUser,
}: SidebarProps) {
  const [confirmTarget, setConfirmTarget] = useState<ConfirmTarget | null>(
    null,
  );
  const listRef = useRef<HTMLDivElement>(null);
  const clearConfirmId = useId();

  const cancelConfirm = useCallback(() => {
    setConfirmTarget(null);
  }, []);

  useEffect(() => {
    if (!confirmTarget) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      const root = listRef.current;
      if (!root) {
        return;
      }
      if (event.target instanceof Node && !root.contains(event.target)) {
        cancelConfirm();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        cancelConfirm();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [cancelConfirm, confirmTarget]);

  const askDeleteSession = (
    event: ReactMouseEvent | ReactKeyboardEvent,
    sessionId: string,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setConfirmTarget({ type: "session", sessionId });
  };

  const handleConfirm = async () => {
    const target = confirmTarget;
    setConfirmTarget(null);
    if (!target) {
      return;
    }
    if (target.type === "all") {
      await onClearSessions();
      return;
    }
    await onRemoveSession(target.sessionId);
  };

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
            <AppIcon size={36} variant="primary" />
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

        <div ref={listRef} className="mt-6 min-h-0 flex-1 overflow-y-auto">
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
                const confirming =
                  confirmTarget?.type === "session" &&
                  confirmTarget.sessionId === session.sessionId;

                if (confirming) {
                  return (
                    <li key={session.sessionId}>
                      <InlineDeleteConfirm
                        onConfirm={() => void handleConfirm()}
                        onCancel={cancelConfirm}
                      />
                    </li>
                  );
                }

                return (
                  <li key={session.sessionId} className="group relative">
                    <button
                      type="button"
                      onClick={() => onSelectSession(session.sessionId)}
                      className={cn(
                        "flex w-full flex-col rounded-sm py-2.5 pr-10 pl-3 text-left transition-colors",
                        active ? "bg-primary-soft" : "hover:bg-bg",
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

                    <button
                      type="button"
                      aria-label={`Excluir conversa ${session.title}`}
                      onClick={(event) =>
                        askDeleteSession(event, session.sessionId)
                      }
                      className={cn(
                        "absolute top-1/2 right-2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-sm text-[#667085] transition-opacity hover:bg-bg focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                        active
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
                      )}
                    >
                      <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
                    </button>
                  </li>
                );
              })
            )}
          </ul>

          {sessions.length >= 2 ? (
            <div className="mt-3 px-1">
              {confirmTarget?.type === "all" ? (
                <div id={clearConfirmId}>
                  <InlineDeleteConfirm
                    label="Excluir esta conversa?"
                    onConfirm={() => void handleConfirm()}
                    onCancel={cancelConfirm}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmTarget({ type: "all" })}
                  className="text-xs text-[#667085] transition-colors hover:text-[#B42318]"
                >
                  Limpar todas
                </button>
              )}
            </div>
          ) : null}

          {serverWarning ? (
            <p
              role="status"
              className="mt-3 px-1 text-xs leading-snug text-[#B42318]"
            >
              {serverWarning}
              {onDismissWarning ? (
                <>
                  {" "}
                  <button
                    type="button"
                    onClick={onDismissWarning}
                    className="underline"
                  >
                    Ok
                  </button>
                </>
              ) : null}
            </p>
          ) : null}
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
