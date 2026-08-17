"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    // Exclude admin pages
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    const currentUrl = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    // Prevent duplicate tracking of exact same URL in succession
    if (lastTrackedPathRef.current === currentUrl) {
      return;
    }
    lastTrackedPathRef.current = currentUrl;

    const payload = JSON.stringify({ path: pathname });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics", blob);
    } else {
      void fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {
        // Silently ignore analytics network failures
      });
    }
  }, [pathname, searchParams]);

  return null;
}
