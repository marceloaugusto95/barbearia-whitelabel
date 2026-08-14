"use client";

import { useCallback, useMemo, useState } from "react";
import { brand } from "@/config/brand";
import { createBooking, createPayment } from "@/lib/api";
import type { OnlinePaymentMethod, PaymentIntent, PaymentMethod } from "@/lib/types";

/** 0 unidade · 1 serviço · 2 dia e horário · 3 dados · 4 pagamento · 5 sucesso */
export const STEPS = ["unit", "service", "time", "confirm", "payment", "done"] as const;
export type Step = (typeof STEPS)[number];

export type BookingPrefill = { unitId?: string; serviceId?: string };

type Selection = {
  unitId: string | null;
  serviceId: string | null;
  /** `null` = sem preferência. */
  barberId: string | null;
  /** Data ISO (YYYY-MM-DD). */
  date: string | null;
  time: string | null;
  name: string;
  phone: string;
  paymentMethod: PaymentMethod | null;
};

const EMPTY: Selection = {
  unitId: null,
  serviceId: null,
  barberId: null,
  date: null,
  time: null,
  name: "",
  phone: "",
  paymentMethod: null,
};

export function useBookingFlow() {
  const [isOpen, setIsOpen] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [selection, setSelection] = useState<Selection>(EMPTY);
  const [payment, setPayment] = useState<PaymentIntent | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const step = STEPS[stepIndex];
  const goToStep = useCallback((target: Step) => setStepIndex(STEPS.indexOf(target)), []);

  const patch = useCallback((next: Partial<Selection>) => {
    setSelection((current) => ({ ...current, ...next }));
  }, []);

  /** Qualquer botão "Agendar" cai aqui; o card de serviço/unidade pré-seleciona. */
  const openBooking = useCallback((prefill?: BookingPrefill) => {
    setSelection((current) => ({ ...current, ...prefill }));
    setSubmitError(null);
    setStepIndex(0);
    setIsOpen(true);
  }, []);

  const closeBooking = useCallback(() => setIsOpen(false), []);

  const back = useCallback(() => {
    setSubmitError(null);
    setStepIndex((current) => Math.max(0, current - 1));
  }, []);

  /** Fechar no sucesso limpa dia, hora, dados e pagamento e volta ao passo 1. */
  const finish = useCallback(() => {
    setIsOpen(false);
    setStepIndex(0);
    setPayment(null);
    setSelection((current) => ({
      ...current,
      date: null,
      time: null,
      name: "",
      phone: "",
      paymentMethod: null,
    }));
  }, []);

  const unit = brand.units.find((u) => u.id === selection.unitId) ?? null;
  const service = brand.services.find((s) => s.id === selection.serviceId) ?? null;
  const barber = brand.barbers.find((b) => b.id === selection.barberId) ?? null;

  /** Validação por passo — trava o botão primário. */
  const canAdvance = useMemo(() => {
    switch (step) {
      case "unit":
        return unit !== null;
      case "service":
        return service !== null;
      case "time":
        return selection.date !== null && selection.time !== null;
      case "confirm":
        return (
          selection.name.trim().length > 1 &&
          selection.phone.trim().length > 5 &&
          selection.paymentMethod !== null
        );
      case "payment":
        return false; // o checkout avança sozinho quando o pagamento aprova
      case "done":
        return true;
    }
  }, [step, unit, service, selection]);

  /**
   * Grava o agendamento e, quando o pagamento é online, abre a intenção e
   * manda para o checkout. "Pagar na hora" não tem o que cobrar: vai direto
   * para a confirmação.
   */
  const submit = useCallback(async () => {
    const { unitId, serviceId, barberId, date, time, name, phone, paymentMethod } =
      selection;
    if (!unitId || !serviceId || !date || !time || !paymentMethod) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const booking = await createBooking({
        unitId,
        serviceId,
        barberId,
        date,
        time,
        name: name.trim(),
        phone: phone.trim(),
        paymentMethod,
      });

      if (paymentMethod === "onsite") {
        goToStep("done");
        return;
      }

      const intent = await createPayment({
        bookingId: booking.id,
        serviceId,
        method: paymentMethod as OnlinePaymentMethod,
      });
      setPayment(intent);
      goToStep("payment");
    } catch {
      setSubmitError("failed");
    } finally {
      setSubmitting(false);
    }
  }, [selection, goToStep]);

  const primaryAction = useCallback(() => {
    if (!canAdvance || submitting) return;
    if (step === "done") return finish();
    if (step === "confirm") return void submit();
    setStepIndex((current) => current + 1);
  }, [canAdvance, submitting, step, finish, submit]);

  return {
    isOpen,
    step,
    stepIndex,
    selection,
    unit,
    service,
    barber,
    payment,
    canAdvance,
    canGoBack: stepIndex > 0 && step !== "payment" && step !== "done",
    submitting,
    submitError,
    openBooking,
    closeBooking,
    back,
    primaryAction,
    /** Chamado pelo checkout quando o pagamento é aprovado. */
    completePayment: useCallback(() => goToStep("done"), [goToStep]),
    setUnit: (unitId: string) => patch({ unitId }),
    setService: (serviceId: string) => patch({ serviceId }),
    setBarber: (barberId: string | null) => patch({ barberId, time: null }),
    /** Trocar de dia limpa o horário selecionado. */
    setDate: (date: string) => patch({ date, time: null }),
    setTime: (time: string) => patch({ time }),
    setName: (name: string) => patch({ name }),
    setPhone: (phone: string) => patch({ phone }),
    setPaymentMethod: (paymentMethod: PaymentMethod) => patch({ paymentMethod }),
  };
}

export type BookingFlow = ReturnType<typeof useBookingFlow>;
