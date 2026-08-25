import type { MetadataRoute } from "next";
import { db } from "~/lib/db";
import { siteUrl } from "~/lib/site-url";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/art`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/shop`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/gallery`, changeFrequency: "monthly", priority: 0.7 },
  ];

  try {
    const [paintings, posts, products] = await Promise.all([
      db.painting.findMany({ select: { id: true }, orderBy: { sortOrder: "asc" } }),
      db.galleryPost.findMany({ select: { id: true }, orderBy: { date: "desc" } }),
      db.product.findMany({ where: { isActive: true }, select: { id: true }, orderBy: { sortOrder: "asc" } }),
    ]);

    return [
      ...staticRoutes,
      ...posts.map((p) => ({
        url: `${siteUrl}/gallery/${p.id}`,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
      ...products.map((p) => ({
        url: `${siteUrl}/shop/${p.id}`,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
