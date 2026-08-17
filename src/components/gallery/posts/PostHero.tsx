import Image from "next/image";
import styles from "./PostHero.module.scss";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";

type Props = {
  title: string;
  coverUrl: string | null;
  date: Date | null;
};

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default function PostHero({ title, coverUrl, date }: Props) {
  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        {coverUrl ? (
          <Image
            src={getOptimizedImageUrl(coverUrl, { preset: "banner" })}
            alt={title}
            fill
            priority
            className={styles.image}
          />
        ) : (
          <div className={styles.noImage} />
        )}
        <div className={styles.overlay} />

        <div className={styles.content}>
          {date && <span className={styles.date}>{formatDate(date)}</span>}
          <h1 className={styles.title}>{title}</h1>
        </div>
      </section>
    </div>
  );
}
