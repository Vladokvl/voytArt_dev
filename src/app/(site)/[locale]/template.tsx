"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { stripLocaleFromPathname } from "~/lib/locale-path";

// Persistent variable across page transitions (SPA page swaps)
let lastPathname = "";

function getRouteIndex(path: string): number {
  if (path === "/") return 0;
  if (path.startsWith("/art")) return 1;
  if (path.startsWith("/gallery")) return 2;
  if (path.startsWith("/shop")) return 3;
  return -1;
}

export default function Template({ children }: { children: React.ReactNode }) {
  const rawPathname = usePathname();
  // Нормалізуємо шлях: прибираємо префікс локалі (/en/art → /art),
  // щоб перехід між мовами не тригерив анімацію сторінки.
  const pathname = stripLocaleFromPathname(rawPathname);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const isAdmin = pathname.startsWith("/admin");
  const isHome = pathname === "/";
  const isArtToArt = pathname.startsWith("/art") && lastPathname.startsWith("/art");
  const isShopToShop = pathname.startsWith("/shop") && lastPathname.startsWith("/shop");
  const isGalleryToGallery = pathname.startsWith("/gallery") && lastPathname.startsWith("/gallery");
  const isFirstLoad = !lastPathname;

  // Skip transitions for admin, going to home page, same-section navigation, or first load
  const shouldSkipTransition =
    isAdmin || isHome || isArtToArt || isShopToShop || isGalleryToGallery || isFirstLoad;

  // Synchronously compute direction on render using the last recorded path
  const prevIdx = getRouteIndex(lastPathname);
  const currIdx = getRouteIndex(pathname);

  let direction: "right" | "left" | "fade" = "fade";
  if (lastPathname && prevIdx !== -1 && currIdx !== -1 && prevIdx !== currIdx) {
    direction = currIdx > prevIdx ? "right" : "left";
  }

  // Update last recorded path after mounting/rendering
  useEffect(() => {
    if (!isAdmin) {
      lastPathname = pathname;
    }
  }, [pathname, isAdmin]);

  if (shouldSkipTransition) {
    return <>{children}</>;
  }

  const variants = {
    initial: (dir: "right" | "left" | "fade") => {
      if (dir === "right") return { x: 40, opacity: 0 };
      if (dir === "left") return { x: -40, opacity: 0 };
      return { y: 10, opacity: 0 };
    },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      ref={wrapperRef}
      custom={direction}
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ width: "100%" }}
      onAnimationComplete={() => {
        if (wrapperRef.current) {
          wrapperRef.current.style.transform = "none";
          wrapperRef.current.style.opacity = "1";
        }
        if (typeof window !== "undefined") {
          window.ScrollTrigger?.refresh();
        }
      }}
    >
      {children}
    </motion.div>
  );
}
