import { type Metadata, type Viewport } from "next";
import { Montserrat } from "next/font/google";
import { Suspense } from "react";
import "~/styles/globals.scss";
import SmoothScroll from "~/components/SmoothScroll/SmoothScroll";
import PageLoader from "~/components/layout/PageLoader/PageLoader";
import FooterWrapper from "~/components/layout/Footer/FooterWrapper";
import NavMenu from "~/components/layout/navMenu/navmenu";
import Header from "~/components/layout/Header/Header";
import AnalyticsTracker from "~/components/analytics/AnalyticsTracker";
import InAppBrowserBanner from "~/components/layout/InAppBrowserBanner/InAppBrowserBanner";
import VhFix from "~/components/layout/VhFix/VhFix";
import { LanguageProvider } from "~/context/LanguageContext";
import { cookies } from "next/headers";
import { type Locale } from "~/lib/i18n";
import { siteUrl } from "~/lib/site-url";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#050505",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "VoytArt Gallery — Contemporary Ukrainian Art",
    template: "%s | VoytArt Gallery",
  },
  description:
    "Contemporary Ukrainian art gallery featuring original paintings, neon installations, limited edition prints, and curated design collectibles.",
  keywords: [
    "VoytArt",
    "Ukrainian Art",
    "Contemporary Art",
    "Art Gallery",
    "Original Paintings",
    "Art Prints",
    "Neon Art",
    "Ukrainian Artists",
    "Сучасне українське мистецтво",
    "Галерея картин",
  ],
  authors: [{ name: "VoytArt Gallery" }],
  creator: "VoytArt",
  publisher: "VoytArt Gallery",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/voytCirclelogo.svg",
  },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    alternateLocale: ["en_US"],
    url: siteUrl,
    siteName: "VoytArt Gallery",
    title: "VoytArt Gallery — Contemporary Ukrainian Art",
    description:
      "Original paintings, limited prints, and exclusive collectibles by Ukrainian contemporary artists.",
    images: [
      {
        url: "/pagesImages/galleryPageHero.jpg",
        width: 1200,
        height: 630,
        alt: "VoytArt Gallery — Ukrainian Contemporary Art",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VoytArt Gallery — Contemporary Ukrainian Art",
    description:
      "Original paintings, limited prints, and exclusive collectibles by Ukrainian contemporary artists.",
    images: ["/pagesImages/galleryPageHero.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const rawLocale = cookieStore.get("NEXT_LOCALE")?.value;
  const initialLocale: Locale = rawLocale === "uk" ? "uk" : "en";

  return (
    <html lang={initialLocale} className={montserrat.variable}>
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: "history.scrollRestoration='manual';window.scrollTo(0,0);" }} />
        <LanguageProvider initialLocale={initialLocale}>
          <VhFix />
          <InAppBrowserBanner />
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          <PageLoader />
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          <NavMenu />
          <SmoothScroll>
            {children}
            <Suspense fallback={null}>
              <FooterWrapper />
            </Suspense>
          </SmoothScroll>
        </LanguageProvider>
      </body>
    </html>
  );
}
