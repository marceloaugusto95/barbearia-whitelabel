import { BookButton } from "@/components/BookButton";
import { content } from "@/config/content";
import styles from "./CtaBand.module.css";

const copy = content.cta;

export function CtaBand() {
  return (
    <section className={styles.band}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{copy.title}</h2>
        <BookButton className={styles.button}>{copy.button}</BookButton>
      </div>
    </section>
  );
}
