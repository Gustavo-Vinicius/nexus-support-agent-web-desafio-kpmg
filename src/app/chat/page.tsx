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
import { StorageKey } from "@/enum/storage-key.enum";
import { useChat } from "@/hooks/useChat";
import {
  getStoredSessionId,
  getStoredToken,
  getStoredUserId,
} from "@/lib/api";
import { getUserByToken } from "@/lib/mockUsers";
import { loadSessions } from "@/lib/session-storage";
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
  onSessionsChange,
  onModelAvailabilityChange,
  onOpenSidebar,
  onCloseSidebar,
  onNewConversation,
  onSelectSession,
  onSwitchUser,
}: {
  token: string;
  userId: string;
  sessionId: string;
  sessions: ChatSessionSummary[];
  modelOnline: boolean;
  sidebarOpen: boolean;
  onSessionsChange: (sessions: ChatSessionSummary[]) => void;
  onModelAvailabilityChange: (online: boolean) => void;
  onOpenSidebar: () => void;
  onCloseSidebar: () => void;
  onNewConversation: () => void;
  onSelectSession: (sessionId: string) => void;
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
    return firstUser?.content.slice(0, 32) || "Nova conversa";
  }, [messages, sessionId, sessions]);

  return (
    <div className="flex h-dvh overflow-hidden bg-bg">
      <Sidebar
        userId={userId}
        token={token}
        sessions={sessions}
        activeSessionId={sessionId}
        open={sidebarOpen}
        onClose={onCloseSidebar}
        onNewConversation={onNewConversation}
        onSelectSession={onSelectSession}
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
  const [sessions, setSessions] = useState<ChatSessionSummary[]>(() =>
    loadSessions(userId),
  );
  const [modelOnline, setModelOnline] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSessionsChange = useCallback((next: ChatSessionSummary[]) => {
    setSessions(next);
  }, []);

  const persistSessionId = (next: string) => {
    try {
      sessionStorage.setItem(StorageKey.SESSION_ID, next);
    } catch {
      // ignore
    }
    setSessionId(next);
  };

  const handleNewConversation = () => {
    persistSessionId(crypto.randomUUID());
    setSidebarOpen(false);
  };

  const handleSelectSession = (nextSessionId: string) => {
    persistSessionId(nextSessionId);
    setSidebarOpen(false);
  };

  const handleSwitchUser = () => {
    try {
      sessionStorage.removeItem(StorageKey.ACCESS_TOKEN);
      sessionStorage.removeItem(StorageKey.USER_ID);
      sessionStorage.removeItem(StorageKey.SESSION_ID);
    } catch {
      // ignore
    }
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
      onSessionsChange={handleSessionsChange}
      onModelAvailabilityChange={setModelOnline}
      onOpenSidebar={() => setSidebarOpen(true)}
      onCloseSidebar={() => setSidebarOpen(false)}
      onNewConversation={handleNewConversation}
      onSelectSession={handleSelectSession}
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
