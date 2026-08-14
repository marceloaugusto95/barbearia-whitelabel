"use client";

import { useEffect, useMemo, useState } from "react";
import { brand } from "@/config/brand";
import { content } from "@/config/content";
import { fetchAvailability } from "@/lib/api";
import { nextDays } from "@/lib/dates";
import type { Slot } from "@/lib/types";
import styles from "./booking.module.css";
import type { BookingFlow } from "./useBookingFlow";

const DAYS_AHEAD = 8;
const copy = content.booking.time;

type Status = "idle" | "loading" | "ready" | "error";

export function StepTime({ flow }: { flow: BookingFlow }) {
  const { unitId, barberId, date, time } = flow.selection;

  // O modal só monta depois de uma interação, então gerar os dias a partir de
  // "hoje" aqui não causa divergência de hidratação.
  const days = useMemo(() => nextDays(DAYS_AHEAD, copy.today), []);

  const [slots, setSlots] = useState<Slot[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!unitId || !date) {
      setStatus("idle");
      setSlots([]);
      return;
    }
    const controller = new AbortController();
    setStatus("loading");

    fetchAvailability({ unitId, barberId, date }, controller.signal)
      .then((result) => {
        setSlots(result);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      });

    return () => controller.abort();
  }, [unitId, barberId, date, attempt]);

  const barbers = [{ id: null, name: copy.barberAny }, ...brand.barbers];

  return (
    <div className={styles.stack}>
      <h2 id="booking-title" className={styles.title}>
        {copy.title}
      </h2>

      <div className={styles.block}>
        <p className={styles.blockLabel} id="booking-barber">
          {copy.barberLabel}
        </p>
        <div className={styles.chips} role="group" aria-labelledby="booking-barber">
          {barbers.map((barber) => {
            const selected = barberId === barber.id;
            return (
              <button
                key={barber.id ?? "any"}
                type="button"
                aria-pressed={selected}
                className={`${styles.chip} ${selected ? styles.chipSelected : ""}`}
                onClick={() => flow.setBarber(barber.id)}
              >
                {barber.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.block}>
        <p className={styles.blockLabel} id="booking-day">
          {copy.dayLabel}
        </p>
        <div className={styles.days} role="group" aria-labelledby="booking-day">
          {days.map((day) => {
            const selected = date === day.iso;
            return (
              <button
                key={day.iso}
                type="button"
                aria-pressed={selected}
                aria-label={day.full}
                className={`${styles.chip} ${styles.day} ${
                  selected ? `${styles.chipSelected} ${styles.daySelected}` : ""
                }`}
                onClick={() => flow.setDate(day.iso)}
              >
                <span className={styles.dayWeekday}>{day.weekday}</span>
                <span className={styles.dayNumber}>{day.day}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.block}>
        <p className={styles.blockLabel} id="booking-time">
          {copy.timeLabel}
        </p>

        {status === "idle" && <p className={styles.state}>{copy.pickDay}</p>}
        {status === "loading" && (
          <p className={styles.state} role="status">
            {copy.loading}
          </p>
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
        {status === "ready" && slots.every((slot) => !slot.available) && (
          <p className={styles.state}>{copy.empty}</p>
        )}
        {status === "ready" && slots.some((slot) => slot.available) && (
          <div className={styles.times} role="group" aria-labelledby="booking-time">
            {slots.map((slot) => {
              const selected = time === slot.time;
              return (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  aria-pressed={selected}
                  className={`${styles.chip} ${styles.time} ${
                    selected ? styles.chipSelected : ""
                  } ${slot.available ? "" : styles.timeTaken}`}
                  onClick={() => flow.setTime(slot.time)}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
