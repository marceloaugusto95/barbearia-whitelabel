import { brand } from "@/config/brand";
import { content } from "@/config/content";
import shared from "@/styles/shared.module.css";
import styles from "./Testimonials.module.css";

const copy = content.testimonials;

export function Testimonials() {
  return (
    <section id="depoimentos" className={shared.section}>
      <div className={shared.container}>
        <p className={shared.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.title}>{copy.title}</h2>

        <div className={styles.grid}>
          {brand.testimonials.map((testimonial) => (
            <blockquote key={testimonial.id} className={styles.card}>
              <p className={styles.quote}>{testimonial.quote}</p>
              <footer className={styles.author}>{testimonial.author}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
