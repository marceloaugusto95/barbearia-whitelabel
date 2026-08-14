import Link from "next/link";
import { redirect } from "next/navigation";
import { AppointmentCard } from "@/components/admin/AppointmentCard";
import styles from "@/components/admin/admin.module.css";
import { brand } from "@/config/brand";
import { content } from "@/config/content";
import { getSession, scopeOf } from "@/lib/auth";
import { currentMonth, todayIso } from "@/lib/clock";
import { listAppointments } from "@/lib/store";
import type { Appointment, AppointmentStatus } from "@/lib/types";

const copy = content.admin.appointments;
const LIMIT = 60;

type Period = "today" | "upcoming" | "month" | "all";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getSession();
  if (!user) redirect("/admin/login");

  const params = await searchParams;
  const single = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const period = (single("periodo") ?? "upcoming") as Period;
  const status = single("status") ?? "all";
  const unitId = single("unidade") ?? "all";
  const barberId = single("barbeiro") ?? "all";

  const scope = scopeOf(user);
  const today = todayIso();
  const month = currentMonth();

  const all = await listAppointments();
  const visible = scope ? all.filter((item) => item.barberId === scope) : all;

  const filtered = visible
    .filter((item) => matchesPeriod(item, period, today, month))
    .filter((item) => status === "all" || item.status === (status as AppointmentStatus))
    .filter((item) => unitId === "all" || item.unitId === unitId)
    .filter((item) => scope !== null || barberId === "all" || item.barberId === barberId);

  const ascending = period === "today" || period === "upcoming";
  const sorted = [...filtered].sort((a, b) => {
    const left = `${a.date} ${a.time}`;
    const right = `${b.date} ${b.time}`;
    return ascending ? left.localeCompare(right) : right.localeCompare(left);
  });

  const shown = sorted.slice(0, LIMIT);

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{copy.title}</h1>
        <p className={styles.pageSubtitle}>{copy.count(shown.length, sorted.length)}</p>
      </div>

      <form className={styles.filters} method="get">
        <div>
          <p className={styles.fieldLabel}>{copy.filters.period}</p>
          <select className={styles.input} name="periodo" defaultValue={period}>
            <option value="today">{copy.filters.periodOptions.today}</option>
            <option value="upcoming">{copy.filters.periodOptions.upcoming}</option>
            <option value="month">{copy.filters.periodOptions.month}</option>
            <option value="all">{copy.filters.periodOptions.all}</option>
          </select>
        </div>

        <div>
          <p className={styles.fieldLabel}>{copy.filters.status}</p>
          <select className={styles.input} name="status" defaultValue={status}>
            <option value="all">{copy.filters.statusAll}</option>
            <option value="confirmed">{content.admin.status.confirmed}</option>
            <option value="completed">{content.admin.status.completed}</option>
            <option value="cancelled">{content.admin.status.cancelled}</option>
          </select>
        </div>

        <div>
          <p className={styles.fieldLabel}>{copy.filters.unit}</p>
          <select className={styles.input} name="unidade" defaultValue={unitId}>
            <option value="all">{copy.filters.unitAll}</option>
            {brand.units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>

        {scope === null && (
          <div>
            <p className={styles.fieldLabel}>{copy.filters.barber}</p>
            <select className={styles.input} name="barbeiro" defaultValue={barberId}>
              <option value="all">{copy.filters.barberAll}</option>
              {brand.barbers.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.filterActions}>
          <button type="submit" className={`${styles.action} ${styles.actionPrimary}`}>
            {copy.filters.apply}
          </button>
          <Link className={styles.navLink} href="/admin/agendamentos">
            {copy.filters.clear}
          </Link>
        </div>
      </form>

      {shown.length > 0 ? (
        <div className={styles.cards}>
          {shown.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>{copy.empty}</p>
      )}
    </>
  );
}

function matchesPeriod(
  appointment: Appointment,
  period: Period,
  today: string,
  month: string,
) {
  switch (period) {
    case "today":
      return appointment.date === today;
    case "upcoming":
      return appointment.date >= today;
    case "month":
      return appointment.date.startsWith(month);
    default:
      return true;
  }
}
