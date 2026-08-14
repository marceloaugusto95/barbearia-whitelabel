"use client";

import { createContext, useContext } from "react";
import { BookingSheet } from "./BookingSheet";
import { useBookingFlow, type BookingFlow } from "./useBookingFlow";

const BookingContext = createContext<BookingFlow | null>(null);

/**
 * Mantém o estado do agendamento acima da página, para que qualquer botão
 * "Agendar" abra o modal e as escolhas sobrevivam a um fechar/abrir.
 */
export function BookingProvider({ children }: { children: React.ReactNode }) {
  const flow = useBookingFlow();

  return (
    <BookingContext.Provider value={flow}>
      {children}
      {flow.isOpen && <BookingSheet flow={flow} />}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const flow = useContext(BookingContext);
  if (!flow) {
    throw new Error("useBooking precisa estar dentro de <BookingProvider>.");
  }
  return flow;
}
