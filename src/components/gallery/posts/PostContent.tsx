"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import styles from "./PostContent.module.scss";
import { useTranslation } from "~/context/LanguageContext";
import { getLocalized } from "~/lib/i18n";
import { sanitizeHtml } from "~/lib/sanitize-html";

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
    <>
      {/* Floating circular back button (mirrors NavMenu trigger on the left) */}
      <Link
        href={getLocalizedHref("/gallery")}
        className={styles.floatingBackBtn}
        aria-label={t("gallery.back")}
      >
        <ArrowLeft size={18} />
      </Link>

      <section className={styles.section}>
        <div className={styles.inner}>
          <Link href={getLocalizedHref("/gallery")} className={styles.backLink}>
            <ArrowLeft size={16} />
            <span>{t("gallery.back")}</span>
          </Link>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
          />
        </div>
      </section>
    </>
  );
}
