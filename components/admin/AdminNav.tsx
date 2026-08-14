"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { content } from "@/config/content";
import styles from "./admin.module.css";

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {content.admin.nav.map((item) => {
        const active =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
