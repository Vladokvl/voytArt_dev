import Link from "next/link";
import styles from "./Sections.module.scss";

// ── NeonSection ─────────────────────────────────────────────────────────────
// Чистий вміст панелі неон-сцени.
// Позиціонування (.panel) та анімація задаються у HeroDesktop / HeroMobile.
export default function NeonSection() {
  return (
    <>
      <div className={styles.metaRow}>
        <span className={styles.sceneStep}>04 / 04</span>
        <span className={`${styles.stat} ${styles.statBonus}`}>Bonus scene</span>
      </div>
      <p className={styles.tagline}>Neon</p>
      <h2 className={styles.heading}>
        Neon
        <br />
        paintings
      </h2>
      <p className={styles.description}>
        A UV-lit concept room where special pigments reveal hidden layers of selected works.
      </p>
      <Link href="/gallery" className={styles.cta}>
        Explore neon →
      </Link>
    </>
  );
}
