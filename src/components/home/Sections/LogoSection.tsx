"use client";
import { forwardRef } from "react";
import Image from "next/image";
import styles from "./Sections.module.scss";

// ── LogoSection ───────────────────────────────────────────────────────────
// Чистий вміст секції-героя: назва галереї, підзаголовок, логотип.
// Анімація (parallax yPercent) задається у HeroDesktop / HeroMobile.
// forwardRef потрібен щоб батьківський компонент міг прикріпити heroRef
// до <section> для GSAP ScrollTrigger.
const LogoSection = forwardRef<HTMLElement>((_, ref) => (
  <section ref={ref} className={styles.heroSection}>
    <div className={styles.heroContent} id="hero-content">
      <h1 className={styles.title}>VOYT ART GALLERY</h1>
      <p className={styles.subtitle}>
        Discover original paintings by Ukrainian artists
      </p>
      <div className={styles.logoWrapper}>
        <Image
          src="/voytCirclelogo.svg"
          alt="Voyt"
          fill
          className={styles.logo}
        />
      </div>
    </div>
  </section>
));

LogoSection.displayName = "LogoSection";
export default LogoSection;
