"use client";

import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

import { Routes } from "@/config/routes";
import { getStoredToken } from "@/lib/api";

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

export default function ChatPage() {
  const token = useSyncExternalStore(
    emptySubscribe,
    () => getStoredToken() ?? "",
    () => null,
  );

  if (token === null) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-bg">
        <p className="text-sm text-text-muted">Carregando sessão…</p>
      </main>
    );
  }

  if (!token) {
    return <RedirectHome />;
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-2 bg-bg px-4">
      <h1 className="text-2xl font-semibold text-text">Chat</h1>
      <p className="text-sm text-text-muted">
        Placeholder da conversa. Sessão autenticada via Bearer token.
      </p>
    </main>
  );
}
