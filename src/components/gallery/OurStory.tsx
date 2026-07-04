"use client";

import styles from "./OurStory.module.scss";
import { motion } from "framer-motion";

export default function OurStory() {
  return (
    <section className={styles.section}>
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className={styles.eyebrow}>Our Story</span>
        <h2 className={styles.heading}>Where Art Meets Community</h2>
        <div className={styles.body}>
          <p>
            VoytArt Gallery is more than a space for paintings — it is a living
            chronicle of events, exhibitions and human connections that happen
            around art every day.
          </p>
          <p>
            Browse our gallery posts to see exhibitions, artist talks, opening
            nights and behind-the-scenes moments that make our community unique.
          </p>
        </div>
        <div className={styles.divider} />
      </motion.div>
    </section>
  );
}
