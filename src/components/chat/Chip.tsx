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
  citation: "border-transparent bg-[#EEF2FF] font-medium text-primary",
  tool: "border-transparent bg-[#F2F4F7] font-normal text-text-muted",
  warning: "border-transparent bg-[#FFFAEB] font-medium text-warning",
  success: "border-transparent bg-[#ECFDF3] font-medium text-success",
  danger: "border-transparent bg-[#FEF3F2] font-medium text-danger",
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
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs",
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {showIcon ? <Icon size={13} strokeWidth={2} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
