import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import styles from "@/components/admin/admin.module.css";
import { brand } from "@/config/brand";
import { content } from "@/config/content";
import { getSession } from "@/lib/auth";

const copy = content.admin;

export const metadata: Metadata = {
  title: `${copy.brandSuffix} — ${brand.name}`,
  robots: { index: false, follow: false },
};

/** Tudo dentro deste grupo exige sessão. */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user) redirect("/admin/login");

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/admin" className={styles.brand}>
            <span className={styles.logo} aria-hidden="true">
              {brand.logoLetter}
            </span>
            <span>
              <span className={styles.brandName}>{brand.name}</span>
              <br />
              <span className={styles.brandSuffix}>{copy.brandSuffix}</span>
            </span>
          </Link>

          <AdminNav />

          <div className={styles.headerActions}>
            <span className={styles.user}>{user.name}</span>
            <Link href="/" className={styles.navLink}>
              {copy.backToSite}
            </Link>
            <form action={signOut}>
              <button type="submit" className={styles.ghostButton}>
                {copy.signOut}
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className={styles.main}>{children}</main>
    </div>
  );
}
