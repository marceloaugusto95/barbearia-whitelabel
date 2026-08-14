import { BookButton } from "@/components/BookButton";
import { brand } from "@/config/brand";
import { content } from "@/config/content";
import shared from "@/styles/shared.module.css";
import styles from "./Units.module.css";

const copy = content.units;

export function Units() {
  return (
    <section
      id="unidades"
      className={`${shared.section} ${shared.sectionAlt} ${styles.section}`}
    >
      <div className={shared.container}>
        <p className={shared.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.title}>{copy.title}</h2>
        <p className={styles.text}>{copy.text}</p>

        <div className={styles.grid}>
          {brand.units.map((unit) => (
            <article key={unit.id} className={styles.card}>
              <div className={styles.media}>
                <p className={shared.placeholderCaption}>[ {copy.imageCaption} ]</p>
              </div>
              <div className={styles.body}>
                <h3 className={styles.name}>{unit.name}</h3>
                <p className={styles.address}>{unit.address}</p>
                <p className={styles.hours}>{unit.hours}</p>
                <BookButton
                  className={styles.cta}
                  prefill={{ unitId: unit.id }}
                  ariaLabel={`${copy.cta}: ${unit.name}`}
                >
                  {copy.cta}
                </BookButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
