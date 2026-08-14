"use client";

import { brand } from "@/config/brand";
import { content } from "@/config/content";
import styles from "./booking.module.css";
import type { BookingFlow } from "./useBookingFlow";

export function StepUnit({ flow }: { flow: BookingFlow }) {
  return (
    <div className={styles.options}>
      <h2 id="booking-title" className={styles.title}>
        {content.booking.unit.title}
      </h2>
      {brand.units.map((unit) => {
        const selected = flow.selection.unitId === unit.id;
        return (
          <button
            key={unit.id}
            type="button"
            aria-pressed={selected}
            className={`${styles.option} ${selected ? styles.optionSelected : ""}`}
            onClick={() => flow.setUnit(unit.id)}
          >
            <span className={styles.optionName}>{unit.name}</span>
            <span className={styles.optionMeta}>{unit.address}</span>
          </button>
        );
      })}
    </div>
  );
}
