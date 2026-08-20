"use client";

import styles from "./OurStory.module.scss";
import { motion } from "framer-motion";
import { useTranslation } from "~/context/LanguageContext";

export default function OurStory() {
  const { t } = useTranslation();

  return (
    <section className={styles.section}>
      <motion.div
        className={styles.inner}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <span className={styles.eyebrow}>{t("gallery.ourStory")}</span>
        <h2 className={styles.heading}>{t("gallery.whereArtMeetsCommunity")}</h2>
        <div className={styles.body}>
          <p>{t("gallery.storyP1")}</p>
          <p>{t("gallery.storyP2")}</p>
        </div>
        <div className={styles.divider} />
      </motion.div>
    </section>
  );
}
