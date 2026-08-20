"use client";

import Image from "next/image";
import styles from "./PostHero.module.scss";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import { useTranslation } from "~/context/LanguageContext";
import { getLocalized, formatLocalizedDate } from "~/lib/i18n";

type Props = {
  post: {
    title: string;
    titleUk?: string | null;
    coverUrl: string | null;
    date: Date | null;
  };
};

export default function PostHero({ post }: Props) {
  const { locale } = useTranslation();
  const title = getLocalized(post, "title", locale);

  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        {post.coverUrl ? (
          <Image
            src={getOptimizedImageUrl(post.coverUrl, { preset: "banner" })}
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
          {post.date && <span className={styles.date}>{formatLocalizedDate(post.date, locale)}</span>}
          <h1 className={styles.title}>{title}</h1>
        </div>
      </section>
    </div>
  );
}
