import { Send } from "lucide-react";
import {
  type FormEvent,
  type KeyboardEvent,
  useState,
} from "react";

import { Button } from "@/components/Button";

type ComposerProps = {
  disabled?: boolean;
  onSend: (message: string) => void;
};

export function Composer({ disabled, onSend }: ComposerProps) {
  const [value, setValue] = useState("");

  const canSend = !disabled && value.trim().length > 0;

  const submit = () => {
    const next = value.trim();
    if (!next || disabled) {
      return;
    }
    onSend(next);
    setValue("");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="border-t border-border bg-surface px-8 py-4 lg:px-12">
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <label htmlFor="chat-composer" className="sr-only">
          Mensagem
        </label>
        <textarea
          id="chat-composer"
          rows={1}
          value={value}
          disabled={disabled}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pergunte sobre pedidos, entregas, devoluções ou cancelamentos…"
          className="max-h-40 min-h-11 flex-1 resize-y rounded-md border border-border bg-bg px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
        />
        <Button type="submit" className="w-auto shrink-0" disabled={!canSend}>
          <Send size={16} strokeWidth={2} aria-hidden="true" />
          Enviar
        </Button>
      </form>
      <p className="mt-2 text-[11px] leading-4 text-text-muted sm:text-xs">
        Respostas baseadas apenas nos seus pedidos e nas políticas oficiais da
        Nexus Commerce. Ações só são executadas com sua confirmação.
      </p>
    </div>
  );
}
