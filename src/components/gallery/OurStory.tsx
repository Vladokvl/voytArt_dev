import styles from "./OurStory.module.scss";

export default function OurStory() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
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
      </div>
    </section>
  );
}
