import Image from "next/image";
import Link from "next/link";
import styles from "./GalleryPosts.module.scss";

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

export default function GalleryPosts({ posts }: { posts: Post[] }) {
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
      </div>
    </section>
  );
}
