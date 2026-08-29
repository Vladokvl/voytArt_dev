"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./GalleryPosts.module.scss";
import { fetchPaginatedPosts } from "~/app/(site)/[locale]/gallery/_actions";
import { motion } from "framer-motion";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import { useTranslation } from "~/context/LanguageContext";
import { getLocalized, formatLocalizedDate } from "~/lib/i18n";

type Post = {
  id: number;
  title: string;
  titleUk?: string | null;
  content: string;
  contentUk?: string | null;
  coverUrl: string | null;
  date: Date | null;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function GalleryPosts({
  initialPosts,
  initialHasMore,
  limit,
}: {
  initialPosts: Post[];
  initialHasMore: boolean;
  limit: number;
}) {
  const { t, locale, getLocalizedHref } = useTranslation();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  // Restore scroll position when returning from a post
  useEffect(() => {
    try {
      const lastPostId = sessionStorage.getItem("voyt_gallery_post_id");
      if (lastPostId) {
        sessionStorage.removeItem("voyt_gallery_post_id");
        // Small timeout to allow DOM and layout to settle
        setTimeout(() => {
          const el = document.getElementById(`post-${lastPostId}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 150);
      }
    } catch {
      // ignore storage access errors
    }
  }, []);

  const loadMore = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetchPaginatedPosts(posts.length, limit);
      // Map post dates back to Date objects from JSON string
      const newPosts = res.posts.map((p) => ({
        ...p,
        date: p.date ? new Date(p.date) : null,
      }));
      setPosts((prev) => [...prev, ...newPosts]);
      setHasMore(res.hasMore);
    } catch (error) {
      console.error("Failed to load more posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={styles.heading}>{t("gallery.postsTitle")}</h2>
        </div>

        <div className={styles.grid}>
          {posts.length === 0 ? (
            <p className={styles.empty}>{t("gallery.empty")}</p>
          ) : (
            posts.map((post) => {
              const localizedTitle = getLocalized(post, "title", locale);
              const localizedContent = getLocalized(post, "content", locale);

              return (
                <motion.div
                  key={post.id}
                  id={`post-${post.id}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Link
                    href={getLocalizedHref(`/gallery/${post.id}`)}
                    className={styles.card}
                    onClick={() => {
                      try {
                        sessionStorage.setItem("voyt_gallery_post_id", String(post.id));
                      } catch {
                        // ignore
                      }
                    }}
                  >
                    <div className={styles.coverWrapper}>
                      {post.coverUrl ? (
                        <Image
                          src={getOptimizedImageUrl(post.coverUrl, { preset: "card" })}
                          alt={localizedTitle}
                          fill
                          className={styles.coverImage}
                        />
                      ) : (
                        <div className={styles.noImage}>🖼</div>
                      )}
                    </div>

                    <div className={styles.cardBody}>
                      {post.date && (
                        <span className={styles.date}>{formatLocalizedDate(post.date, locale)}</span>
                      )}
                      <h3 className={styles.title}>{localizedTitle}</h3>
                      <p className={styles.excerpt}>{stripHtml(localizedContent)}</p>
                      <span className={styles.readMore}>{t("gallery.readMore")}</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </div>

        {hasMore && (
          <div className={styles.loadMoreContainer}>
            <button
              onClick={loadMore}
              disabled={loading}
              className={styles.loadMoreBtn}
            >
              {loading ? t("gallery.loading") : t("gallery.showMore")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
