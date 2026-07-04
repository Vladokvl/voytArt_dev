"use client";

import Image from "next/image";
import styles from "./GalleryHero.module.scss";
import { motion } from "framer-motion";

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
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            VoytArt Gallery
          </motion.span>
          <motion.h1
            className={styles.heading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Discover Our Gallery
          </motion.h1>
          <motion.p
            className={styles.subheading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Stories, events and moments captured through art and photography
          </motion.p>
        </div>

        <div className={styles.scrollHint}>
          <span>scroll</span>
          <div className={styles.scrollLine} />
        </div>
      </section>
    </div>
  );
}
