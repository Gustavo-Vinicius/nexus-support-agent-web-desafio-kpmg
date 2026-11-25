import { Routes } from "@/config/routes";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-text">
          Nexus Support Agent
        </h1>
        <p className="text-sm text-text-2">
          Área de autenticação pronta. Próximo passo: formulário de login.
        </p>
        <a
          href={Routes.dashboard}
          className="inline-flex h-11 items-center justify-center rounded-[var(--radius-control)] bg-accent px-5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          Ir para o dashboard
        </a>
      </div>
    </div>
  );
}
