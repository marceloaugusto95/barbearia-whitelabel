"use client";

import { useBooking } from "@/components/booking/BookingProvider";
import type { BookingPrefill } from "@/components/booking/useBookingFlow";

/**
 * Ilha cliente: qualquer "Agendar" da página abre o modal no passo 1.
 * `prefill` deixa a unidade ou o serviço já escolhidos.
 */
export function BookButton({
  className,
  prefill,
  ariaLabel,
  children,
}: {
  className?: string;
  prefill?: BookingPrefill;
  /** Nome acessível quando o rótulo visível se repete na página. */
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  const { openBooking } = useBooking();

  return (
    <button
      type="button"
      className={className}
      aria-label={ariaLabel}
      onClick={() => openBooking(prefill)}
    >
      {children}
    </button>
  );
}
