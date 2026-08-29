import type { MetadataRoute } from "next";
import { db } from "~/lib/db";
import { siteUrl } from "~/lib/site-url";
import { ROUTE_LOCALES } from "~/lib/locale-path";

export const revalidate = 3600;

/** Локалізовані alternate-лінки для кожного шляху */
function localizedAlternates(path: string): MetadataRoute.Sitemap[number]["alternates"] {
  const languages: Record<string, string> = {};
  for (const locale of ROUTE_LOCALES) {
    languages[locale === "uk" ? "uk-UA" : "en-US"] =
      `${siteUrl}/${locale}${path === "/" ? "" : path}`;
  }
  return { languages };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Локалізовані статичні сторінки для обох мов
  const staticPaths = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1 },
    { path: "/art", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/shop", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/gallery", changeFrequency: "monthly" as const, priority: 0.7 },
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.flatMap((entry) =>
    ROUTE_LOCALES.map((locale) => ({
      url: `${siteUrl}/${locale}${entry.path === "/" ? "" : entry.path}`,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: localizedAlternates(entry.path),
    })),
  );

  try {
    const [posts, products] = await Promise.all([
      db.galleryPost.findMany({ select: { id: true }, orderBy: { date: "desc" } }),
      db.product.findMany({ where: { isActive: true }, select: { id: true }, orderBy: { sortOrder: "asc" } }),
    ]);

    return [
      ...staticRoutes,
      ...ROUTE_LOCALES.flatMap((locale) => [
        ...posts.map((p) => ({
          url: `${siteUrl}/${locale}/gallery/${p.id}`,
          changeFrequency: "monthly" as const,
          priority: 0.6,
          alternates: localizedAlternates(`/gallery/${p.id}`),
        })),
        ...products.map((p) => ({
          url: `${siteUrl}/${locale}/shop/${p.id}`,
          changeFrequency: "weekly" as const,
          priority: 0.8,
          alternates: localizedAlternates(`/shop/${p.id}`),
        })),
      ]),
    ];
  } catch (err) {
    console.error("Sitemap generation error:", err);
    throw err;
  }
}
