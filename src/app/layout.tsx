import { type Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Suspense } from "react";
import "~/styles/globals.scss";
import SmoothScroll from "~/components/SmoothScroll/SmoothScroll";
import PageLoader from "~/components/layout/PageLoader/PageLoader";
import FooterWrapper from "~/components/layout/Footer/FooterWrapper";
import NavMenu from "~/components/layout/navMenu/navmenu";

export const metadata: Metadata = {
  title: "VoytArt Gallery",
  description: "Original paintings by Ukrainian artists",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk" className={montserrat.variable}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: "history.scrollRestoration='manual';window.scrollTo(0,0);" }} />
        <PageLoader />
        <NavMenu />
        <SmoothScroll>
          {children}
          <Suspense fallback={null}>
            <FooterWrapper />
          </Suspense>
        </SmoothScroll>
      </body>
    </html>
  );
}
