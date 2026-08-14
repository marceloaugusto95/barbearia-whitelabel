import Link from "next/link";
import { redirect } from "next/navigation";
import { AppointmentCard } from "@/components/admin/AppointmentCard";
import styles from "@/components/admin/admin.module.css";
import { content } from "@/config/content";
import { getSession, scopeOf } from "@/lib/auth";
import { formatLongDate, toIsoDate } from "@/lib/dates";
import { computeKpis, performanceByBarber } from "@/lib/metrics";
import { formatBRL } from "@/lib/money";
import { listAppointments } from "@/lib/store";

const copy = content.admin.dashboard;

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) redirect("/admin/login");

  const scope = scopeOf(user);
  const all = await listAppointments();
  // Barbeiro só enxerga a própria agenda.
  const visible = scope ? all.filter((item) => item.barberId === scope) : all;

  const today = toIsoDate(new Date());
  const month = today.slice(0, 7);

  const kpis = computeKpis(visible, today, month);
  const barbers = performanceByBarber(
    visible.filter((item) => item.date.startsWith(month)),
  );
  const todayList = visible
    .filter((item) => item.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <>
      <div className={styles.pageHead}>
        <h1 className={styles.pageTitle}>{copy.title}</h1>
        <p className={styles.pageSubtitle}>
          {copy.subtitle(user.name, formatLongDate(today))}
        </p>
        {scope && <p className={styles.notice}>{copy.scopedNotice}</p>}
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>{copy.clientsTitle}</h2>
        </div>
        <div className={styles.kpiGrid}>
          <Kpi label={copy.cards.attendedTotal} value={String(kpis.attended.total)} />
          <Kpi label={copy.cards.attendedToday} value={String(kpis.attended.today)} />
          <Kpi label={copy.cards.attendedMonth} value={String(kpis.attended.month)} />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>{copy.revenueTitle}</h2>
        </div>
        <div className={styles.kpiGrid}>
          <Kpi label={copy.cards.revenueTotal} value={formatBRL(kpis.revenue.total)} accent />
          <Kpi label={copy.cards.revenueToday} value={formatBRL(kpis.revenue.today)} accent />
          <Kpi label={copy.cards.revenueMonth} value={formatBRL(kpis.revenue.month)} accent />
        </div>
        <div className={styles.kpiGrid}>
          <Kpi label={copy.cards.ticket} value={formatBRL(kpis.ticket)} />
          <Kpi label={copy.cards.cancelled} value={String(kpis.cancelled)} />
          <Kpi label={copy.cards.upcoming} value={String(kpis.upcoming)} />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>{copy.barbersTitle}</h2>
          <p className={styles.sectionHint}>{copy.barbersHint}</p>
        </div>
        {barbers.some((row) => row.attended > 0) ? (
          <div className={styles.barbers}>
            {barbers.map((row) => (
              <div key={row.id} className={styles.barberRow}>
                <div className={styles.barberTop}>
                  <span className={styles.barberName}>{row.name}</span>
                  <span className={styles.barberValue}>{formatBRL(row.revenue)}</span>
                </div>
                <div className={styles.track}>
                  <span
                    className={styles.trackFill}
                    style={{ width: `${Math.round(row.share * 100)}%` }}
                  />
                </div>
                <span className={styles.barberMeta}>
                  {row.attended} atendimento(s) · ticket {formatBRL(row.ticket)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>{copy.barbersEmpty}</p>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>{copy.todayTitle}</h2>
          <Link className={styles.navLink} href="/admin/agendamentos">
            {copy.seeAll}
          </Link>
        </div>
        {todayList.length > 0 ? (
          <div className={styles.cards}>
            {todayList.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>{copy.todayEmpty}</p>
        )}
      </section>
    </>
  );
}

function Kpi({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={styles.kpi}>
      <p className={styles.kpiLabel}>{label}</p>
      <p className={`${styles.kpiValue} ${accent ? styles.kpiAccent : ""}`}>{value}</p>
    </div>
  );
}
