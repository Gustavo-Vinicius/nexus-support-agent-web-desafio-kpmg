import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
};

export function Button({
  children,
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2.5 text-sm font-medium leading-5 transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        variant === "primary" &&
          "bg-primary text-white hover:bg-[#4338CA]",
        variant === "secondary" &&
          "border border-border bg-surface text-text hover:bg-bg",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
