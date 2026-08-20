"use client";

import Link from "next/link";
import styles from "./PostContent.module.scss";
import { useTranslation } from "~/context/LanguageContext";
import { getLocalized } from "~/lib/i18n";

type Props = {
  post: {
    content: string;
    contentUk?: string | null;
  };
};

export default function PostContent({ post }: Props) {
  const { t, locale, getLocalizedHref } = useTranslation();
  const content = getLocalized(post, "content", locale);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <Link href={getLocalizedHref("/gallery")} className={styles.backLink}>
          {t("gallery.back")}
        </Link>
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
