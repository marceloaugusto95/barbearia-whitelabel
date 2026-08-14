"use client";

import { useActionState, useEffect, useState } from "react";
import { rescheduleAppointment, type ActionState } from "@/app/admin/actions";
import { content } from "@/config/content";
import { fetchAvailability } from "@/lib/api";
import { toIsoDate } from "@/lib/dates";
import type { Slot } from "@/lib/types";
import styles from "./admin.module.css";

const copy = content.admin.card;

type Status = "loading" | "ready" | "error";

export function RescheduleForm({
  appointment,
}: {
  appointment: { id: string; unitId: string; barberId: string | null; date: string; time: string };
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(appointment.date);
  const [time, setTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    rescheduleAppointment,
    null,
  );

  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    setStatus("loading");

    fetchAvailability(
      { unitId: appointment.unitId, barberId: appointment.barberId, date },
      controller.signal,
    )
      .then((result) => {
        setSlots(result);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      });

    return () => controller.abort();
  }, [open, date, appointment.unitId, appointment.barberId]);

  // Reagendou com sucesso: a lista já foi revalidada, é só fechar.
  useEffect(() => {
    if (!pending && state === null && open && time) setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, pending]);

  if (!open) {
    return (
      <button type="button" className={styles.action} onClick={() => setOpen(true)}>
        {copy.reschedule}
      </button>
    );
  }

  const free = slots.filter((slot) => slot.available);

  return (
    <form className={styles.reschedule} action={formAction}>
      <input type="hidden" name="id" value={appointment.id} />
      <input type="hidden" name="time" value={time ?? ""} />

      <div>
        <p className={styles.fieldLabel}>{copy.newDate}</p>
        <input
          className={styles.input}
          type="date"
          name="date"
          value={date}
          min={toIsoDate(new Date())}
          onChange={(event) => {
            setDate(event.target.value);
            setTime(null);
          }}
          required
        />
      </div>

      <div>
        <p className={styles.fieldLabel}>{copy.newTime}</p>
        {status === "loading" && <p className={styles.state}>{copy.loadingTimes}</p>}
        {status === "error" && (
          <p className={styles.error} role="alert">
            {copy.timesError}
          </p>
        )}
        {status === "ready" && free.length === 0 && (
          <p className={styles.state}>{copy.noTimes}</p>
        )}
        {status === "ready" && free.length > 0 && (
          <div className={styles.slots}>
            {free.map((slot) => (
              <button
                key={slot.time}
                type="button"
                aria-pressed={time === slot.time}
                className={`${styles.slot} ${time === slot.time ? styles.slotSelected : ""}`}
                onClick={() => setTime(slot.time)}
              >
                {slot.time}
              </button>
            ))}
          </div>
        )}
      </div>

      {state?.error && (
        <p className={styles.error} role="alert">
          {copy.rescheduleError}
        </p>
      )}

      <div className={styles.cardActions}>
        <button
          type="submit"
          className={`${styles.action} ${styles.actionPrimary}`}
          disabled={!time || pending}
        >
          {pending ? copy.saving : copy.save}
        </button>
        <button type="button" className={styles.action} onClick={() => setOpen(false)}>
          {copy.rescheduleClose}
        </button>
      </div>
    </form>
  );
}
