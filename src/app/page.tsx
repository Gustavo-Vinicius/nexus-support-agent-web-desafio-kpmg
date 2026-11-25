"use client";

import { useRouter } from "next/navigation";
import { type KeyboardEvent, useCallback, useId, useState } from "react";

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
      sessionStorage.setItem(StorageKey.USER_ID, selected.userId);
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
    <main className="relative min-h-screen overflow-hidden bg-primary">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-[42vh] -right-[33vw] aspect-square w-[76vw] rounded-full bg-white/[0.06] sm:-top-[380px] sm:-right-[480px] sm:h-[1100px] sm:w-[1100px]"
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-5 px-4">
        <AppIcon size={96} variant="light" />

        <div className="space-y-2 text-center">
          <h1 className="text-[40px] leading-[1.15] font-bold tracking-[-0.02em] text-white">
            Nexus Support Agent
          </h1>
          <p className="text-sm leading-5 text-white/80">
            Atendimento da Nexus Commerce com respostas fundamentadas
          </p>
        </div>

        <section
          aria-labelledby={`${groupId}-title`}
          className="flex w-full max-w-[440px] flex-col gap-3.5 rounded-lg bg-surface p-6 shadow-[0_8px_30px_rgba(15,23,42,0.08)] max-[480px]:max-w-none"
        >
          <div className="space-y-1">
            <h2
              id={`${groupId}-title`}
              className="text-base leading-6 font-semibold text-text"
            >
              Entrar como cliente
            </h2>
            <p className="text-xs leading-4 text-text-muted">
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

          <Button className="w-full" onClick={startConversation}>
            Iniciar conversa
          </Button>

          <p className="text-xs leading-4 text-text-muted">
            A identidade vem do token, nunca do texto enviado ao modelo.
          </p>
        </section>
      </div>

      <p className="absolute bottom-[50px] left-1/2 z-10 -translate-x-1/2 text-center text-xs leading-4 text-white/60">
        versão 1.0 · ambiente de avaliação
      </p>
    </main>
  );
}
