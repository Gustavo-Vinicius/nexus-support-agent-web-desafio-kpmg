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
  const isLight = variant === "light";
  const surface = isLight ? "#FFFFFF" : "#4F46E5";
  const ink = isLight ? "#4F46E5" : "#FFFFFF";
  const radius = 96 * 0.27;

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
      <rect width="96" height="96" rx={radius} fill={surface} />
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
