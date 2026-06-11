import Link from "next/link";
import styles from "./Sections.module.scss";

// ── ArtShopSection ────────────────────────────────────────────────────────
// Чистий вміст панелі 2: «Art shop».
// Позиціонування (.panel .panelRight) та анімація задаються у HeroDesktop / HeroMobile.
export default function ArtShopSection() {
  return (
    <>
      <div className={styles.metaRow}>
        <span className={styles.sceneStep}>03 / 04</span>
        <span className={styles.stat}>Limited pieces</span>
      </div>
      <p className={styles.tagline}>Shop</p>
      <h2 className={styles.heading}>
        Art shop
      </h2>
      <p className={styles.description}>
        Collect prints, objects, and curated pieces inspired by our current exhibitions.
      </p>
      <Link
        href="/shop"
        className={`${styles.cta} ${styles.ctaAccent}`}
      >
        Explore the shop →
      </Link>
    </>
  );
}
