import Link from "next/link";
import styles from "./Sections.module.scss";

// ── ArtSection ────────────────────────────────────────────────────────────
// Чистий вміст панелі 1: «Discover our art».
// Позиціонування (.panel) та анімація задаються у HeroDesktop / HeroMobile.
export default function ArtSection() {
  return (
    <>
      <div className={styles.metaRow}>
        <span className={styles.sceneStep}>02 / 04</span>
        <span className={styles.stat}>Original works</span>
      </div>
      <p className={styles.tagline}>Art</p>
      <h2 className={styles.heading}>
        Discover
        <br />
        our art
      </h2>
      <p className={styles.description}>
        Explore paintings, collections, and visual narratives created by our artists.
      </p>
      <Link href="/art" className={styles.cta}>
        Browse paintings →
      </Link>
    </>
  );
}
