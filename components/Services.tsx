import { BookButton } from "@/components/BookButton";
import { brand, priceLabel } from "@/config/brand";
import { content } from "@/config/content";
import shared from "@/styles/shared.module.css";
import styles from "./Services.module.css";

const copy = content.services;

export function Services() {
  return (
    <section id="servicos" className={`${shared.section} ${shared.sectionAlt}`}>
      <div className={shared.container}>
        <p className={shared.eyebrow}>{copy.eyebrow}</p>
        <h2 className={styles.title}>{copy.title}</h2>

        <div className={styles.grid}>
          {brand.services.map((service) => (
            <article key={service.id} className={styles.card}>
              <p className={styles.duration}>{service.duration}</p>
              <h3 className={styles.name}>{service.name}</h3>
              <p className={styles.description}>{service.description}</p>
              <div className={styles.footer}>
                <span className={styles.price}>{priceLabel(service.price)}</span>
                <BookButton
                  className={styles.cta}
                  prefill={{ serviceId: service.id }}
                  ariaLabel={`${content.booking.openLabel} ${service.name}`}
                >
                  {content.booking.openLabel}
                </BookButton>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
