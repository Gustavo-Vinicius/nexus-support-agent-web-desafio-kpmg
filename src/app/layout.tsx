import "@/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nexus Support Agent",
  description: "Atendimento da Nexus Commerce com respostas fundamentadas",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={cn(inter.variable, "h-full antialiased font-sans")}
    >
      <body
        className="flex h-full min-h-0 flex-col"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
