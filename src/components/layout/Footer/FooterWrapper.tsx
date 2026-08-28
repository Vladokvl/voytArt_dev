"use client";
import { usePathname, useSearchParams } from "next/navigation";
import Footer from "./footer";
import { stripLocaleFromPathname } from "~/lib/locale-path";

export default function FooterWrapper() {
  const rawPathname = usePathname();
  const searchParams = useSearchParams();
  // Нормалізуємо: прибираємо префікс локалі (/en/shop → /shop)
  const pathname = stripLocaleFromPathname(rawPathname);

  if (pathname.startsWith("/admin")) return null;
  if (pathname === "/art" && searchParams.toString() === "") return null;

  return <Footer />;
}
