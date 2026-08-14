"use client";

import { useFormStatus } from "react-dom";

/**
 * Botão de submit com estado de envio. Com `confirmMessage`, pede confirmação
 * antes de disparar a ação (usado no cancelamento).
 */
export function SubmitButton({
  className,
  confirmMessage,
  children,
}: {
  className?: string;
  confirmMessage?: string;
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={className}
      disabled={pending}
      onClick={(event) => {
        if (confirmMessage && !window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
