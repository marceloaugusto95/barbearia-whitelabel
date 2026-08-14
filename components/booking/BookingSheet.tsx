"use client";

import { useEffect, useRef } from "react";
import { content } from "@/config/content";
import styles from "./booking.module.css";
import { StepConfirm } from "./StepConfirm";
import { StepDone } from "./StepDone";
import { StepPayment } from "./StepPayment";
import { StepService } from "./StepService";
import { StepTime } from "./StepTime";
import { StepUnit } from "./StepUnit";
import type { BookingFlow } from "./useBookingFlow";

const copy = content.booking;

export function BookingSheet({ flow }: { flow: BookingFlow }) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Trava o scroll do fundo e devolve o foco ao elemento que abriu o modal.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    sheetRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") flow.closeBooking();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      opener?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const primaryLabel = flow.submitting
    ? content.booking.confirm.sending
    : copy.primaryLabels[flow.stepIndex];

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) flow.closeBooking();
      }}
    >
      <div
        ref={sheetRef}
        className={styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        tabIndex={-1}
      >
        <div className={styles.head}>
          <p className={styles.stepLabel}>{copy.stepLabels[flow.stepIndex]}</p>
          <button
            type="button"
            className={styles.close}
            aria-label={copy.close}
            onClick={flow.closeBooking}
          >
            ×
          </button>
        </div>

        {flow.step === "unit" && <StepUnit flow={flow} />}
        {flow.step === "service" && <StepService flow={flow} />}
        {flow.step === "time" && <StepTime flow={flow} />}
        {flow.step === "confirm" && <StepConfirm flow={flow} />}
        {flow.step === "payment" && <StepPayment flow={flow} />}
        {flow.step === "done" && <StepDone flow={flow} />}

        {/* O checkout não tem rodapé: ele avança sozinho quando o pagamento aprova. */}
        {flow.step !== "payment" && (
          <div className={styles.footer}>
            {flow.canGoBack && (
              <button type="button" className={styles.back} onClick={flow.back}>
                {copy.back}
              </button>
            )}
            <button
              type="button"
              className={styles.primary}
              disabled={!flow.canAdvance || flow.submitting}
              onClick={flow.primaryAction}
            >
              {primaryLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
