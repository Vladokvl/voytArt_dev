"use client";
import { usePathname, useSearchParams } from "next/navigation";
import Footer from "./footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pathname.startsWith("/admin")) return null;
  if (pathname === "/art" && searchParams.toString() === "") return null;

  return <Footer />;
}
