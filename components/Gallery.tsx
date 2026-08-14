import { brand } from "@/config/brand";
import { content } from "@/config/content";
import shared from "@/styles/shared.module.css";
import styles from "./Gallery.module.css";

const copy = content.gallery;

export function Gallery() {
  return (
    <section id="galeria" className={shared.section}>
      <div className={shared.container}>
        <div className={styles.head}>
          <div>
            <p className={shared.eyebrow}>{copy.eyebrow}</p>
            <h2 className={styles.title}>{copy.title}</h2>
          </div>
          <p className={styles.text}>{copy.text}</p>
        </div>

        <div className={styles.grid}>
          {brand.gallery.map((item) => (
            <div key={item.id} className={styles.item}>
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img className={styles.photo} src={item.image} alt={item.caption} />
              ) : (
                <p className={shared.placeholderCaption}>[ {item.caption} ]</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
