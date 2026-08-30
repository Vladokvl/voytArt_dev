"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedRef = useRef<{ url: string; timestamp: number }>({ url: "", timestamp: 0 });

  useEffect(() => {
    // Exclude admin & api pages
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    const currentUrl = searchParams.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname;

    const now = Date.now();
    // Prevent duplicate tracking of exact same URL within 1.5 seconds (React StrictMode, double events)
    if (lastTrackedRef.current.url === currentUrl && now - lastTrackedRef.current.timestamp < 1500) {
      return;
    }
    lastTrackedRef.current = { url: currentUrl, timestamp: now };

    const paintingParam = searchParams.get("painting");
    const artistParam = searchParams.get("artist");
    let targetId: number | undefined = undefined;
    let pageType: string | undefined = undefined;

    if (paintingParam) {
      const parsed = parseInt(paintingParam, 10);
      if (!isNaN(parsed)) {
        targetId = parsed;
        pageType = "PAINTING";
      }
    } else if (artistParam) {
      const parsed = parseInt(artistParam, 10);
      if (!isNaN(parsed)) {
        targetId = parsed;
        pageType = "ARTIST";
      }
    } else if (pathname.includes("/shop/")) {
      const match = /\/shop\/(\d+)/.exec(pathname);
      if (match?.[1]) {
        const parsed = parseInt(match[1], 10);
        if (!isNaN(parsed)) {
          targetId = parsed;
          pageType = "PRODUCT";
        }
      }
    } else if (pathname.includes("/gallery/")) {
      const match = /\/gallery\/(\d+)/.exec(pathname);
      if (match?.[1]) {
        const parsed = parseInt(match[1], 10);
        if (!isNaN(parsed)) {
          targetId = parsed;
          pageType = "POSTS";
        }
      }
    }

    const payload = JSON.stringify({
      path: currentUrl,
      targetId,
      pageType,
    });

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
