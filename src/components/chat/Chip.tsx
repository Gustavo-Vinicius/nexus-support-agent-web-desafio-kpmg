import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  type LucideIcon,
  Wrench,
  XCircle,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ChipVariant =
  | "citation"
  | "tool"
  | "warning"
  | "success"
  | "danger";

const VARIANT_STYLES: Record<ChipVariant, string> = {
  citation: "border-border bg-surface text-text-muted",
  tool: "border-border bg-bg text-text-muted",
  warning: "border-warning/30 bg-warning-soft text-warning",
  success: "border-success/30 bg-success-soft text-success",
  danger: "border-danger/30 bg-danger-soft text-danger",
};

const VARIANT_ICONS: Record<ChipVariant, LucideIcon> = {
  citation: FileText,
  tool: Wrench,
  warning: AlertTriangle,
  success: CheckCircle2,
  danger: XCircle,
};

type ChipProps = {
  variant: ChipVariant;
  children: ReactNode;
  className?: string;
  showIcon?: boolean;
};

export function Chip({
  variant,
  children,
  className,
  showIcon = true,
}: ChipProps) {
  const Icon = VARIANT_ICONS[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {showIcon ? <Icon size={12} strokeWidth={2} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
