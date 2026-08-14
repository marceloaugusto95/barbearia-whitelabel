import type { Metadata } from "next";
import { redirect } from "next/navigation";
import styles from "@/components/admin/admin.module.css";
import { brand } from "@/config/brand";
import { demoPasswordInUse } from "@/config/staff";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: `Acesso da equipe — ${brand.name}`,
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");

  return (
    <main className={styles.login}>
      <LoginForm demoPassword={demoPasswordInUse()} />
    </main>
  );
}
