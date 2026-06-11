import Image from "next/image";
import styles from "./GalleryHero.module.scss";

export default function GalleryHero() {
  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <Image
          src="/pagesImages/galleryPageHero.jpg"
          alt="Gallery hero"
          fill
          priority
          className={styles.image}
        />
        <div className={styles.overlay} />

        <div className={styles.content}>
          <span className={styles.eyebrow}>VoytArt Gallery</span>
          <h1 className={styles.heading}>Discover Our Gallery</h1>
          <p className={styles.subheading}>
            Stories, events and moments captured through art and photography
          </p>
        </div>

        <div className={styles.scrollHint}>
          <span>scroll</span>
          <div className={styles.scrollLine} />
        </div>
      </section>
    </div>
  );
}
