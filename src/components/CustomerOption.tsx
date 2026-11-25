import type { MockUser } from "@/lib/mockUsers";
import { cn } from "@/lib/utils";

type CustomerOptionProps = {
  user: MockUser;
  selected: boolean;
  onSelect: (userId: string) => void;
  id: string;
};

export function CustomerOption({
  user,
  selected,
  onSelect,
  id,
}: CustomerOptionProps) {
  return (
    <button
      id={id}
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={selected ? 0 : -1}
      onClick={() => onSelect(user.userId)}
      className={cn(
        "flex w-full items-start gap-3 rounded-md px-3.5 py-3 text-left transition-colors",
        selected
          ? "border-[1.5px] border-primary bg-primary-soft"
          : "border border-border bg-surface hover:bg-bg",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border",
          selected ? "border-primary bg-primary" : "border-border bg-surface",
        )}
      >
        {selected ? (
          <span className="size-1.5 rounded-full bg-white" />
        ) : null}
      </span>

      <span className="min-w-0 flex-1 space-y-0.5">
        <span className="block text-sm font-semibold text-text">
          {user.userId}{" "}
          <span className="font-normal text-text-muted">
            · Bearer {user.token}
          </span>
        </span>
        <span className="block text-xs text-text-muted">{user.summary}</span>
      </span>
    </button>
  );
}
