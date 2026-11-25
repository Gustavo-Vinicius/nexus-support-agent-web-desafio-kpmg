import type { ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-dvh overflow-hidden bg-app-bg">
      <main className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-[1440px] px-8 pt-7 pb-10">
          {children}
        </div>
      </main>
    </div>
  );
}
