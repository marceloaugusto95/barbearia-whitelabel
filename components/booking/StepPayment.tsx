"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { content } from "@/config/content";
import { fetchPayment } from "@/lib/api";
import { formatBRL } from "@/lib/money";
import shared from "@/styles/shared.module.css";
import styles from "./booking.module.css";
import type { BookingFlow } from "./useBookingFlow";

const copy = content.booking.payment;

/** Intervalo entre consultas de status e pausa para o "aprovado" ser lido. */
const POLL_INTERVAL_MS = 600;
const APPROVED_PAUSE_MS = 900;

type Status = "pending" | "approved" | "error";

/**
 * Checkout automático: abre logo depois de confirmar o agendamento, acompanha
 * a intenção de pagamento e segue sozinho para a confirmação quando aprova.
 */
export function StepPayment({ flow }: { flow: BookingFlow }) {
  const { payment, completePayment } = flow;
  const [status, setStatus] = useState<Status>("pending");
  const [copied, setCopied] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // Evita recriar o efeito de polling a cada render.
  const completeRef = useRef(completePayment);
  completeRef.current = completePayment;

  const intentId = payment?.id;

  useEffect(() => {
    if (!intentId) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    const controller = new AbortController();
    setStatus("pending");

    const poll = async () => {
      try {
        const result = await fetchPayment(intentId, controller.signal);
        if (cancelled) return;

        if (result.status === "approved") {
          setStatus("approved");
          timer = setTimeout(() => {
            if (!cancelled) completeRef.current();
          }, APPROVED_PAUSE_MS);
          return;
        }
        timer = setTimeout(poll, POLL_INTERVAL_MS);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        if (!cancelled) setStatus("error");
      }
    };

    timer = setTimeout(poll, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      controller.abort();
    };
  }, [intentId, attempt]);

  const copyCode = useCallback(async () => {
    if (!payment?.pixCode) return;
    try {
      await navigator.clipboard.writeText(payment.pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sem permissão de clipboard: o código continua visível para copiar à mão.
    }
  }, [payment?.pixCode]);

  if (!payment) return null;

  const isPix = payment.method === "pix";

  return (
    <div className={styles.payment}>
      <h2 id="booking-title" className={styles.title}>
        {isPix ? copy.pixTitle : copy.cardTitle}
      </h2>

      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>{copy.total}</span>
          <span className={styles.paymentAmount}>{formatBRL(payment.amount)}</span>
        </div>
      </div>

      {isPix && status !== "error" && (
        <>
          <div className={styles.qr}>
            <p className={shared.placeholderCaption}>[ {copy.qrCaption} ]</p>
          </div>
          <div className={styles.block}>
            <p className={styles.blockLabel}>{copy.codeLabel}</p>
            <p className={styles.pixCode}>{payment.pixCode}</p>
            <button type="button" className={styles.copyButton} onClick={copyCode}>
              {copied ? copy.copied : copy.copy}
            </button>
          </div>
        </>
      )}

      {status === "pending" && (
        <>
          <div className={styles.progress} aria-hidden="true">
            <span
              className={styles.progressBar}
              style={{ animationDuration: `${payment.expectedDelayMs}ms` }}
            />
          </div>
          <p className={styles.state} role="status">
            {copy.waiting}
          </p>
        </>
      )}

      {status === "approved" && (
        <div className={styles.approved} role="status">
          <span className={styles.approvedIcon} aria-hidden="true">
            ✓
          </span>
          <p className={styles.approvedText}>{copy.approved}</p>
        </div>
      )}

      {status === "error" && (
        <>
          <p className={styles.state} role="alert">
            {copy.error}
          </p>
          <button
            type="button"
            className={styles.retry}
            onClick={() => setAttempt((current) => current + 1)}
          >
            {copy.retry}
          </button>
        </>
      )}

      <p className={styles.note}>{copy.simulated}</p>
    </div>
  );
}
