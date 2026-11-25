import Image from "next/image";

import { cn } from "@/lib/utils";

type AppIconProps = {
  size?: number;
  variant?: "primary" | "light";
  className?: string;
};

function AppIconSvg({
  size,
  surface,
  ink,
  className,
}: {
  size: number;
  surface: string;
  ink: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
    >
      <rect width="96" height="96" rx="26" fill={surface} />
      <g
        transform="translate(22 20) scale(2.166)"
        stroke={ink}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="m9 10 2 2 4-4" />
      </g>
    </svg>
  );
}

export function AppIcon({
  size = 96,
  variant = "light",
  className,
}: AppIconProps) {
  if (variant === "light") {
    return (
      <Image
        src="/assets/app-icon.png"
        alt=""
        width={size}
        height={size}
        priority
        className={cn("shrink-0", className)}
        aria-hidden="true"
      />
    );
  }

  return (
    <AppIconSvg
      size={size}
      surface="#4F46E5"
      ink="#FFFFFF"
      className={className}
    />
  );
}
