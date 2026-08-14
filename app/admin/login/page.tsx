import type { Metadata } from "next";
import { redirect } from "next/navigation";
import styles from "@/components/admin/admin.module.css";
import { brand } from "@/config/brand";
import { DEMO_PASSWORD } from "@/config/staff";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: `Acesso da equipe — ${brand.name}`,
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  if (await getSession()) redirect("/admin");

  // A dica de senha só aparece fora de produção.
  const demoPassword =
    process.env.NODE_ENV === "production" ? null : DEMO_PASSWORD;

  return (
    <main className={styles.login}>
      <LoginForm demoPassword={demoPassword} />
    </main>
  );
}
