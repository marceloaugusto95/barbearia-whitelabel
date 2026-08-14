import { cancelAppointment, completeAppointment } from "@/app/admin/actions";
import { brand } from "@/config/brand";
import { content } from "@/config/content";
import { formatWeekdayDate } from "@/lib/dates";
import { formatBRL } from "@/lib/money";
import type { Appointment } from "@/lib/types";
import styles from "./admin.module.css";
import { RescheduleForm } from "./RescheduleForm";
import { SubmitButton } from "./SubmitButton";

const copy = content.admin;

const PILL_CLASS = {
  confirmed: styles.pillConfirmed,
  completed: styles.pillCompleted,
  cancelled: "",
} as const;

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const unit = brand.units.find((item) => item.id === appointment.unitId);
  const service = brand.services.find((item) => item.id === appointment.serviceId);
  const barber = brand.barbers.find((item) => item.id === appointment.barberId);

  const paymentLabel =
    appointment.paymentState === "paid"
      ? copy.payment.paid
      : appointment.paymentState === "onsite"
        ? copy.payment.onsite
        : copy.payment.pending;

  const isOpen = appointment.status === "confirmed";

  return (
    <article
      className={`${styles.card} ${
        appointment.status === "cancelled" ? styles.cardCancelled : ""
      }`}
    >
      <div className={styles.cardTop}>
        <span className={styles.cardWhen}>
          {appointment.time}
          <span className={styles.cardDate}>{formatWeekdayDate(appointment.date)}</span>
        </span>
        <span className={`${styles.pill} ${PILL_CLASS[appointment.status]}`}>
          {copy.status[appointment.status]}
        </span>
      </div>

      <h3 className={styles.cardCustomer}>{appointment.customerName}</h3>

      <div className={styles.cardLines}>
        <div className={styles.cardLine}>
          <span className={styles.cardLabel}>{copy.card.fields.service}</span>
          <span className={styles.cardValue}>{service?.name ?? appointment.serviceId}</span>
        </div>
        <div className={styles.cardLine}>
          <span className={styles.cardLabel}>{copy.card.fields.unit}</span>
          <span className={styles.cardValue}>{unit?.name ?? appointment.unitId}</span>
        </div>
        <div className={styles.cardLine}>
          <span className={styles.cardLabel}>{copy.card.fields.barber}</span>
          <span className={styles.cardValue}>{barber?.name ?? copy.card.barberAny}</span>
        </div>
        <div className={styles.cardLine}>
          <span className={styles.cardLabel}>{copy.card.fields.contact}</span>
          <span className={styles.cardValue}>{appointment.customerPhone}</span>
        </div>
        <div className={styles.cardLine}>
          <span className={styles.cardLabel}>{paymentLabel}</span>
          <span className={`${styles.cardValue} ${styles.cardAmount}`}>
            {formatBRL(appointment.amount)}
          </span>
        </div>
      </div>

      {isOpen && (
        <div className={styles.cardActions}>
          <form action={completeAppointment}>
            <input type="hidden" name="id" value={appointment.id} />
            <SubmitButton className={`${styles.action} ${styles.actionPrimary}`}>
              {copy.card.complete}
            </SubmitButton>
          </form>

          <RescheduleForm
            appointment={{
              id: appointment.id,
              unitId: appointment.unitId,
              barberId: appointment.barberId,
              date: appointment.date,
              time: appointment.time,
            }}
          />

          <form action={cancelAppointment}>
            <input type="hidden" name="id" value={appointment.id} />
            <SubmitButton
              className={styles.action}
              confirmMessage={copy.card.cancelConfirm}
            >
              {copy.card.cancel}
            </SubmitButton>
          </form>
        </div>
      )}
    </article>
  );
}
