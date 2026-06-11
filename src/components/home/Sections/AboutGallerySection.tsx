import Link from "next/link";
import styles from "./Sections.module.scss";

// ── AboutGallerySection ───────────────────────────────────────────────────
// Чистий вміст панелі 0: «About our gallery».
// Позиціонування (.panel) та анімація задаються у HeroDesktop / HeroMobile.
export default function AboutGallerySection() {
  return (
    <>
      <div className={styles.metaRow}>
        <span className={styles.sceneStep}>01 / 04</span>
        <span className={styles.stat}>Latest stories</span>
      </div>
      <p className={styles.tagline}>About</p>
      <h2 className={styles.heading}>
        About our
        <br />
        gallery
      </h2>
      <p className={styles.description}>
        Step inside our exhibitions, behind-the-scenes process, and moments from the space.
      </p>
      <Link href="/gallery" className={styles.cta}>
        View gallery stories →
      </Link>
    </>
  );
}
