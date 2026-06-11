import Link from "next/link";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        {/* Contact */}
        <div>
          <p className={styles.blockTitle}>Contact</p>
          <p className={styles.tagline}>Get in touch</p>
          <div className={styles.socials}>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/voyt_art_gallery_?utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
              </svg>
            </a>
            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/17NP1yjV29/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Email */}
        <div>
          <p className={styles.blockTitle}>Email</p>
          <a
            href="mailto:voytartgallery@gmail.com"
            className={styles.emailLink}
          >
            voytartgallery@gmail.com
          </a>
        </div>

        {/* Quick nav */}
        <div>
          <p className={styles.blockTitle}>Navigate</p>
          <nav className={styles.quickNav} aria-label="Footer navigation">
            <Link href="/" className={`${styles.quickLink} ${styles.quickLinkHome}`}>
              На головну
            </Link>
            <Link href="/art" className={styles.quickLink}>
              Art
            </Link>
            <Link href="/gallery" className={styles.quickLink}>
              Gallery
            </Link>
            <Link href="/shop" className={styles.quickLink}>
              Shop
            </Link>
          </nav>
        </div>

      </div>

      {/* Bottom bar */}
      <div className={styles.bottom}>
        © {new Date().getFullYear()}. All rights reserved. VoytArtGallery
      </div>
    </footer>
  );
}
