"use client";

import { availablePayments, priceLabel } from "@/config/brand";
import { content } from "@/config/content";
import { formatLongDate } from "@/lib/dates";
import styles from "./booking.module.css";
import type { BookingFlow } from "./useBookingFlow";

const copy = content.booking.confirm;

export function StepConfirm({ flow }: { flow: BookingFlow }) {
  const { selection, unit, service, barber } = flow;

  const when = [
    selection.date ? formatLongDate(selection.date) : "—",
    selection.time,
  ]
    .filter(Boolean)
    .join(" · ");

  const rows = [
    { label: copy.rows.unit, value: unit?.name ?? "—" },
    { label: copy.rows.service, value: service?.name ?? "—" },
    { label: copy.rows.barber, value: barber?.name ?? content.booking.time.barberAny },
    { label: copy.rows.when, value: when },
    {
      label: copy.rows.total,
      value: service ? priceLabel(service.price, copy.totalFallback) : "—",
    },
  ];

  return (
    <div className={styles.form}>
      <h2 id="booking-title" className={styles.title}>
        {copy.title}
      </h2>

      <div className={styles.summary}>
        {rows.map((row) => (
          <div key={row.label} className={styles.summaryRow}>
            <span className={styles.summaryLabel}>{row.label}</span>
            <span className={styles.summaryValue}>{row.value}</span>
          </div>
        ))}
      </div>

      <input
        className={styles.input}
        type="text"
        name="name"
        autoComplete="name"
        aria-label={copy.namePlaceholder}
        placeholder={copy.namePlaceholder}
        value={selection.name}
        onChange={(event) => flow.setName(event.target.value)}
      />
      <input
        className={styles.input}
        type="tel"
        name="phone"
        inputMode="tel"
        autoComplete="tel"
        aria-label={copy.phonePlaceholder}
        placeholder={copy.phonePlaceholder}
        value={selection.phone}
        onChange={(event) => flow.setPhone(event.target.value)}
      />

      <div className={styles.block}>
        <p className={styles.blockLabel} id="booking-payment">
          {copy.paymentLabel}
        </p>
        <div className={styles.chips} role="group" aria-labelledby="booking-payment">
          {availablePayments().map((method) => {
            const isSelected = selection.paymentMethod === method;
            return (
              <button
                key={method}
                type="button"
                aria-pressed={isSelected}
                className={`${styles.chip} ${isSelected ? styles.chipSelected : ""}`}
                onClick={() => flow.setPaymentMethod(method)}
              >
                {copy.methods[method]}
              </button>
            );
          })}
        </div>
        {selection.paymentMethod && (
          <p className={styles.hint}>{copy.methodHints[selection.paymentMethod]}</p>
        )}
      </div>

      {flow.submitError && (
        <p className={styles.error} role="alert">
          {copy.error}
        </p>
      )}
    </div>
  );
}
