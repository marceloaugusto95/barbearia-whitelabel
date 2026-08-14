import { BookButton } from "@/components/BookButton";
import { content } from "@/config/content";
import styles from "./Hero.module.css";

const copy = content.hero;

export function Hero() {
  return (
    <section id="top" className={styles.hero}>
      <div className={styles.grid}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{copy.eyebrow}</p>
          <h1 className={styles.title}>{copy.title}</h1>
          <p className={styles.text}>{copy.text}</p>

          <div className={styles.actions}>
            <BookButton className={styles.primary}>{copy.primaryCta}</BookButton>
            <a className={styles.secondary} href="#servicos">
              {copy.secondaryCta}
            </a>
          </div>

          <div className={styles.stats}>
            {copy.stats.map((stat) => (
              <div key={stat.label}>
                <p className={styles.statValue}>{stat.value}</p>
                <p className={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.media}>
          <p className={styles.mediaCaption}>[ {copy.imageCaption} ]</p>
        </div>
      </div>
    </section>
  );
}
