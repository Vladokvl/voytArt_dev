import Link from "next/link";
import styles from "./PostContent.module.scss";

export default function PostContent({ content }: { content: string }) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <Link href="/gallery" className={styles.backLink}>
          ← Back
        </Link>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
