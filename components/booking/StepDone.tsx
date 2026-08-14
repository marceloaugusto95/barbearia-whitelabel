"use client";

import { brand } from "@/config/brand";
import { content } from "@/config/content";
import { formatLongDate } from "@/lib/dates";
import { formatBRL } from "@/lib/money";
import styles from "./booking.module.css";
import type { BookingFlow } from "./useBookingFlow";

const copy = content.booking.done;

export function StepDone({ flow }: { flow: BookingFlow }) {
  const { selection, unit, service } = flow;
  const firstName = selection.name.trim().split(" ")[0];

  const method = selection.paymentMethod;
  const total = service && brand.showPrices ? formatBRL(service.price * 100) : null;
  const paymentLine =
    method && total
      ? method === "onsite"
        ? copy.onsite(total)
        : copy.paid(content.booking.confirm.methods[method], total)
      : null;

  return (
    <div className={styles.done}>
      <span className={styles.doneIcon} aria-hidden="true">
        ✓
      </span>
      <h2 id="booking-title" className={styles.doneTitle}>
        {copy.title}
      </h2>
      <p className={styles.doneText}>
        {copy.message(
          firstName,
          unit?.name ?? "",
          selection.date ? formatLongDate(selection.date) : "",
          selection.time ?? "",
        )}
      </p>
      {paymentLine && <p className={styles.donePayment}>{paymentLine}</p>}
    </div>
  );
}
