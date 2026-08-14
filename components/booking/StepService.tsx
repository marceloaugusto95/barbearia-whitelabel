"use client";

import { brand, priceLabel } from "@/config/brand";
import { content } from "@/config/content";
import styles from "./booking.module.css";
import type { BookingFlow } from "./useBookingFlow";

export function StepService({ flow }: { flow: BookingFlow }) {
  return (
    <div className={styles.options}>
      <h2 id="booking-title" className={styles.title}>
        {content.booking.service.title}
      </h2>
      {brand.services.map((service) => {
        const selected = flow.selection.serviceId === service.id;
        return (
          <button
            key={service.id}
            type="button"
            aria-pressed={selected}
            className={`${styles.option} ${selected ? styles.optionSelected : ""}`}
            onClick={() => flow.setService(service.id)}
          >
            <span className={styles.optionTop}>
              <span className={styles.optionName}>{service.name}</span>
              <span className={styles.optionPrice}>
                {priceLabel(service.price, "—")}
              </span>
            </span>
            <span className={styles.optionMeta}>{service.duration}</span>
          </button>
        );
      })}
    </div>
  );
}
