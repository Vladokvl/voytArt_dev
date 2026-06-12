"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./GalleryPosts.module.scss";
import { fetchPaginatedPosts } from "~/app/gallery/_actions";

type Post = {
  id: number;
  title: string;
  content: string;
  coverUrl: string | null;
  date: Date | null;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
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
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

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
          <h2 className={styles.heading}>Gallery Posts</h2>
        </div>

        <div className={styles.grid}>
          {posts.length === 0 ? (
            <p className={styles.empty}>No posts yet.</p>
          ) : (
            posts.map((post) => (
              <Link
                key={post.id}
                href={`/gallery/${post.id}`}
                className={styles.card}
              >
                <div className={styles.coverWrapper}>
                  {post.coverUrl ? (
                    <Image
                      src={post.coverUrl}
                      alt={post.title}
                      fill
                      className={styles.coverImage}
                    />
                  ) : (
                    <div className={styles.noImage}>🖼</div>
                  )}
                </div>

                <div className={styles.cardBody}>
                  {post.date && (
                    <span className={styles.date}>{formatDate(post.date)}</span>
                  )}
                  <h3 className={styles.title}>{post.title}</h3>
                  <p className={styles.excerpt}>{stripHtml(post.content)}</p>
                  <span className={styles.readMore}>Learn more →</span>
                </div>
              </Link>
            ))
          )}
        </div>

        {hasMore && (
          <div className={styles.loadMoreContainer}>
            <button
              onClick={loadMore}
              disabled={loading}
              className={styles.loadMoreBtn}
            >
              {loading ? "Loading..." : "Show More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
