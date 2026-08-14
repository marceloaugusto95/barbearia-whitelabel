import { brand } from "@/config/brand";
import { content } from "@/config/content";
import styles from "./Footer.module.css";

const copy = content.footer;

export function Footer() {
  const { instagram, whatsapp, email } = brand.contact;

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <p className={styles.brandName}>{brand.name}</p>
          <p className={styles.tagline}>
            {copy.tagline[0]}
            <br />
            {copy.tagline[1]}
          </p>
        </div>

        <div className={styles.column}>
          <p className={styles.columnTitle}>{copy.navTitle}</p>
          {content.nav.slice(0, 3).map((item) => (
            <a key={item.href} className={styles.link} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>

        <div className={styles.column}>
          <p className={styles.columnTitle}>{copy.contactTitle}</p>
          <a
            className={styles.link}
            href={`https://instagram.com/${instagram.replace("@", "")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {instagram}
          </a>
          <a
            className={styles.link}
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.whatsappLabel}
          </a>
          <a className={styles.link} href={`mailto:${email}`}>
            {email}
          </a>
        </div>
      </div>

      <p className={styles.legal}>{copy.legal(brand.name)}</p>
    </footer>
  );
}
