import { Button } from "@/components/Button";
import type { PendingAction } from "@/lib/types";

type ConfirmationCardProps = {
  action: PendingAction;
  resolved: boolean | null | undefined;
  disabled?: boolean;
  onConfirm: () => void;
  onKeep: () => void;
};

export function ConfirmationCard({
  action,
  resolved,
  disabled,
  onConfirm,
  onKeep,
}: ConfirmationCardProps) {
  const isResolved = resolved === true || resolved === false;

  return (
    <div className="mt-3 rounded-md border border-warning bg-warning-soft p-3.5 px-4">
      <p className="text-sm font-semibold text-text">
        Confirmar cancelamento do pedido #{action.orderId}?
      </p>
      <p className="mt-1 text-[13px] leading-5 text-text-muted">
        Essa ação registra a solicitação de cancelamento. Só será processada
        após a sua confirmação explícita.
      </p>

      {isResolved ? (
        <p className="mt-3 text-sm font-medium text-text" aria-live="polite">
          {resolved
            ? "Você confirmou o cancelamento."
            : "Você optou por manter o pedido."}
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Button
            className="w-full sm:w-auto"
            disabled={disabled}
            onClick={onConfirm}
            aria-label={`Confirmar cancelamento do pedido ${action.orderId}`}
          >
            Confirmar cancelamento
          </Button>
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            disabled={disabled}
            onClick={onKeep}
            aria-label={`Manter o pedido ${action.orderId}`}
          >
            Manter pedido
          </Button>
        </div>
      )}
    </div>
  );
}
