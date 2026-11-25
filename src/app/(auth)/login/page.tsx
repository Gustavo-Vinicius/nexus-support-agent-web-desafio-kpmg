import { Routes } from "@/config/routes";

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-text">
          Nexus Support Agent
        </h1>
        <p className="text-sm text-text-muted">
          Use a tela inicial para entrar com um cliente simulado.
        </p>
        <a
          href={Routes.home}
          className="inline-flex h-11 items-center justify-center rounded-sm bg-primary px-5 text-sm font-medium text-white transition-colors hover:bg-[#4338CA]"
        >
          Ir para a abertura
        </a>
      </div>
    </div>
  );
}
