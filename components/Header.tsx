"use client";

import { useState } from "react";
import { useBooking } from "@/components/booking/BookingProvider";
import { brand } from "@/config/brand";
import { content } from "@/config/content";
import styles from "./Header.module.css";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openBooking } = useBooking();

  // Abrir o agendamento fecha o drawer.
  const book = () => {
    setMenuOpen(false);
    openBooking();
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a href="#top" className={styles.brand} onClick={() => setMenuOpen(false)}>
          {brand.logoImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className={styles.logoImage} src={brand.logoImage} alt="" />
          ) : (
            <span className={styles.logo} aria-hidden="true">
              {brand.logoLetter}
            </span>
          )}
          <span className={styles.brandName}>{brand.name}</span>
        </a>

        <nav className={styles.nav}>
          {content.nav.map((item) => (
            <a key={item.href} className={styles.navLink} href={item.href}>
              {item.label}
            </a>
          ))}
          <button type="button" className={styles.navCta} onClick={book}>
            {content.booking.openLabel}
          </button>
        </nav>

        <button
          type="button"
          className={styles.menuButton}
          aria-label="Menu"
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>
      </div>

      {menuOpen && (
        <nav id="menu-mobile" className={styles.drawer}>
          {content.nav.map((item) => (
            <a
              key={item.href}
              className={styles.drawerLink}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <button type="button" className={styles.drawerCta} onClick={book}>
            {content.booking.openLabelMobile}
          </button>
        </nav>
      )}
    </header>
  );
}
