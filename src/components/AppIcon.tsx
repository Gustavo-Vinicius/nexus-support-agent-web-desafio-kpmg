import { MessageSquareCheck } from "lucide-react";

import { cn } from "@/lib/utils";

type AppIconProps = {
  size?: number;
  variant?: "primary" | "light";
  className?: string;
};

export function AppIcon({
  size = 96,
  variant = "light",
  className,
}: AppIconProps) {
  const iconSize = Math.round(size * 0.48);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-[26px]",
        variant === "light" && "bg-surface text-primary",
        variant === "primary" && "bg-primary text-surface",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <MessageSquareCheck
        size={iconSize}
        strokeWidth={2}
        absoluteStrokeWidth
      />
    </div>
  );
}
