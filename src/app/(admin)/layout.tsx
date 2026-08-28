import type { Metadata } from "next";
import RootShell from "~/components/layout/RootShell";

export const metadata: Metadata = {
  title: "Admin | VoytArt Gallery",
  robots: { index: false, follow: false },
};

/**
 * Адмінка живе поза локальними сегментами ([locale]) і має власне дерево
 * роутів із окремим root-layout.
 */
export default function AdminGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootShell>{children}</RootShell>;
}