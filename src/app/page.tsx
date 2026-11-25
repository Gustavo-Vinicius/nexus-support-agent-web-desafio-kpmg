"use client";

import { useRouter } from "next/navigation";
import { type KeyboardEvent,useCallback, useId, useState } from "react";

import { AppIcon } from "@/components/AppIcon";
import { Button } from "@/components/Button";
import { CustomerOption } from "@/components/CustomerOption";
import { Routes } from "@/config/routes";
import { StorageKey } from "@/enum/storage-key.enum";
import { MOCK_USERS } from "@/lib/mockUsers";

export default function HomePage() {
  const router = useRouter();
  const groupId = useId();
  const [selectedUserId, setSelectedUserId] = useState(MOCK_USERS[0].userId);

  const selectedIndex = MOCK_USERS.findIndex(
    (user) => user.userId === selectedUserId,
  );

  const selectByIndex = useCallback((index: number) => {
    const next = MOCK_USERS[index];
    if (next) {
      setSelectedUserId(next.userId);
    }
  }, []);

  const startConversation = useCallback(() => {
    const selected = MOCK_USERS.find((user) => user.userId === selectedUserId);

    if (!selected) {
      return;
    }

    try {
      sessionStorage.setItem(StorageKey.ACCESS_TOKEN, selected.token);
      sessionStorage.setItem(StorageKey.SESSION_ID, crypto.randomUUID());
    } catch {
      // sessionStorage pode falhar em modo privado / restrições do browser
    }

    router.push(Routes.chat);
  }, [router, selectedUserId]);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      selectByIndex((selectedIndex + 1) % MOCK_USERS.length);
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      selectByIndex(
        (selectedIndex - 1 + MOCK_USERS.length) % MOCK_USERS.length,
      );
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      startConversation();
    }
  };

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-primary">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 size-[520px] rounded-full bg-white/[0.06]"
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-5 px-4 py-16">
        <AppIcon size={96} variant="light" />

        <div className="space-y-2 text-center">
          <h1 className="text-[40px] leading-tight font-bold text-white">
            Nexus Support Agent
          </h1>
          <p className="text-sm text-white/80">
            Atendimento da Nexus Commerce com respostas fundamentadas
          </p>
        </div>

        <section
          aria-labelledby={`${groupId}-title`}
          className="flex w-full max-w-[440px] flex-col gap-3.5 rounded-lg bg-surface p-6 max-[480px]:mx-4 max-[480px]:max-w-none"
        >
          <div className="space-y-1">
            <h2
              id={`${groupId}-title`}
              className="text-base font-semibold text-text"
            >
              Entrar como cliente
            </h2>
            <p className="text-xs text-text-muted">
              Autenticação simulada para a avaliação
            </p>
          </div>

          <div
            role="radiogroup"
            aria-labelledby={`${groupId}-title`}
            className="flex flex-col gap-2.5"
            onKeyDown={handleKeyDown}
          >
            {MOCK_USERS.map((user) => (
              <CustomerOption
                key={user.userId}
                id={`${groupId}-${user.userId}`}
                user={user}
                selected={user.userId === selectedUserId}
                onSelect={setSelectedUserId}
              />
            ))}
          </div>

          <Button onClick={startConversation}>Iniciar conversa</Button>

          <p className="text-xs text-text-muted">
            A identidade vem do token, nunca do texto enviado ao modelo.
          </p>
        </section>
      </div>

      <p className="absolute bottom-[50px] left-1/2 z-10 -translate-x-1/2 text-center text-xs text-white/60">
        versão 1.0 · ambiente de avaliação
      </p>
    </main>
  );
}
