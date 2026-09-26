import { type Metadata } from "next";
import { notFound } from "next/navigation";
import RootShell, { baseMetadata } from "~/components/layout/RootShell";
import { siteUrl } from "~/lib/site-url";

export const dynamic = "force-dynamic";

/** 404 для будь-якого першого сегмента, який не є валідною локаллю */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "uk") notFound();

  return <RootShell localeParam={locale}>{children}</RootShell>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // hreflang-альтернативи для локалізованих URL
  return {
    ...baseMetadata,
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        "en-US": `${siteUrl}/en`,
        "uk-UA": `${siteUrl}/uk`,
      },
    },
  };
}