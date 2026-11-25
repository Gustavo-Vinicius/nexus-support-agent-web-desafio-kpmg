"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import { ChatHeader } from "@/components/chat/ChatHeader";
import { Composer } from "@/components/chat/Composer";
import { MessageList } from "@/components/chat/MessageList";
import { Sidebar } from "@/components/chat/Sidebar";
import { Routes } from "@/config/routes";
import { useChat } from "@/hooks/useChat";
import { useSessions } from "@/hooks/useSessions";
import {
  getStoredSessionId,
  getStoredToken,
  getStoredUserId,
} from "@/lib/api";
import {
  clearAuthSession,
  persistSessionId,
} from "@/lib/auth-session";
import { getUserByToken } from "@/lib/mockUsers";
import { truncateTitle } from "@/lib/session-storage";
import type { ChatSessionSummary } from "@/lib/types";

const emptySubscribe = () => () => {};

function RedirectHome() {
  const router = useRouter();

  useEffect(() => {
    router.replace(Routes.home);
  }, [router]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg">
      <p className="text-sm text-text-muted">Redirecionando…</p>
    </main>
  );
}

function ChatSessionView({
  token,
  userId,
  sessionId,
  sessions,
  modelOnline,
  sidebarOpen,
  serverWarning,
  onSessionsChange,
  onModelAvailabilityChange,
  onOpenSidebar,
  onCloseSidebar,
  onNewConversation,
  onSelectSession,
  onRemoveSession,
  onClearSessions,
  onDismissWarning,
  onSwitchUser,
}: {
  token: string;
  userId: string;
  sessionId: string;
  sessions: ChatSessionSummary[];
  modelOnline: boolean;
  sidebarOpen: boolean;
  serverWarning: string | null;
  onSessionsChange: (sessions: ChatSessionSummary[]) => void;
  onModelAvailabilityChange: (online: boolean) => void;
  onOpenSidebar: () => void;
  onCloseSidebar: () => void;
  onNewConversation: () => void;
  onSelectSession: (sessionId: string) => void;
  onRemoveSession: (sessionId: string) => void | Promise<void>;
  onClearSessions: () => void | Promise<void>;
  onDismissWarning: () => void;
  onSwitchUser: () => void;
}) {
  const { messages, isLoading, send, confirm, retry } = useChat({
    userId,
    token,
    sessionId,
    onSessionsChange,
    onModelAvailabilityChange,
  });

  const title = useMemo(() => {
    const active = sessions.find((session) => session.sessionId === sessionId);
    if (active?.title) {
      return active.title;
    }
    const firstUser = messages.find((message) => message.role === "user");
    return firstUser
      ? truncateTitle(firstUser.content)
      : "Nova conversa";
  }, [messages, sessionId, sessions]);

  return (
    <div className="flex h-dvh overflow-hidden bg-bg">
      <Sidebar
        userId={userId}
        token={token}
        sessions={sessions}
        activeSessionId={sessionId}
        open={sidebarOpen}
        serverWarning={serverWarning}
        onClose={onCloseSidebar}
        onNewConversation={onNewConversation}
        onSelectSession={onSelectSession}
        onRemoveSession={onRemoveSession}
        onClearSessions={onClearSessions}
        onDismissWarning={onDismissWarning}
        onSwitchUser={onSwitchUser}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          title={title}
          sessionId={sessionId}
          userId={userId}
          modelOnline={modelOnline}
          onOpenSidebar={onOpenSidebar}
        />

        <MessageList
          messages={messages}
          isLoading={isLoading}
          onSuggestion={send}
          onConfirm={confirm}
          onRetry={retry}
        />

        <Composer disabled={isLoading} onSend={send} />
      </div>
    </div>
  );
}

function ChatWorkspace({
  token,
  userId,
  initialSessionId,
}: {
  token: string;
  userId: string;
  initialSessionId: string;
}) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState(initialSessionId);
  const [modelOnline, setModelOnline] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    list: sessions,
    remove,
    clear,
    replace,
    serverWarning,
    dismissWarning,
  } = useSessions(userId);

  const handleNewConversation = useCallback(() => {
    const next = crypto.randomUUID();
    persistSessionId(next);
    setSessionId(next);
    setSidebarOpen(false);
  }, []);

  const handleSelectSession = (nextSessionId: string) => {
    persistSessionId(nextSessionId);
    setSessionId(nextSessionId);
    setSidebarOpen(false);
  };

  const handleRemoveSession = useCallback(
    async (targetSessionId: string) => {
      await remove(targetSessionId);
      if (targetSessionId === sessionId) {
        handleNewConversation();
      }
    },
    [handleNewConversation, remove, sessionId],
  );

  const handleClearSessions = useCallback(async () => {
    await clear();
    handleNewConversation();
  }, [clear, handleNewConversation]);

  const handleSwitchUser = () => {
    clearAuthSession();
    router.replace(Routes.home);
  };

  return (
    <ChatSessionView
      key={sessionId}
      token={token}
      userId={userId}
      sessionId={sessionId}
      sessions={sessions}
      modelOnline={modelOnline}
      sidebarOpen={sidebarOpen}
      serverWarning={serverWarning}
      onSessionsChange={replace}
      onModelAvailabilityChange={setModelOnline}
      onOpenSidebar={() => setSidebarOpen(true)}
      onCloseSidebar={() => setSidebarOpen(false)}
      onNewConversation={handleNewConversation}
      onSelectSession={handleSelectSession}
      onRemoveSession={handleRemoveSession}
      onClearSessions={handleClearSessions}
      onDismissWarning={dismissWarning}
      onSwitchUser={handleSwitchUser}
    />
  );
}

function readAuthSnapshot() {
  const token = getStoredToken();
  const sessionId = getStoredSessionId();
  const storedUserId = getStoredUserId();
  const user = token ? getUserByToken(token) : undefined;
  const userId = storedUserId ?? user?.userId ?? null;

  if (!token || !sessionId || !userId) {
    return "";
  }

  return JSON.stringify({ token, sessionId, userId });
}

export default function ChatPage() {
  const authSnapshot = useSyncExternalStore(
    emptySubscribe,
    readAuthSnapshot,
    () => "",
  );

  if (!authSnapshot) {
    return <RedirectHome />;
  }

  const auth = JSON.parse(authSnapshot) as {
    token: string;
    sessionId: string;
    userId: string;
  };

  return (
    <ChatWorkspace
      token={auth.token}
      userId={auth.userId}
      initialSessionId={auth.sessionId}
    />
  );
}
