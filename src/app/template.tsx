"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

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
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

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

  if (isAdmin) {
    return <>{children}</>;
  }

  const variants = {
    initial: (dir: "right" | "left" | "fade") => {
      if (dir === "right") return { x: 80, opacity: 0 };
      if (dir === "left") return { x: -80, opacity: 0 };
      return { y: 15, opacity: 0 };
    },
    animate: {
      x: 0,
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      custom={direction}
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{ type: "spring", stiffness: 260, damping: 28 }}
      style={{ overflowX: "hidden", width: "100%" }}
    >
      {children}
    </motion.div>
  );
}
