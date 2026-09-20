"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

/**
 * Automatically synchronizes admin tables across multiple devices:
 * 1. Revalidates immediately when user switches tabs or focuses the window (e.g. unlocks mobile screen).
 * 2. Periodically polls (every 25 seconds) on list pages when the tab is active and visible.
 * Does not interrupt active editing or creation forms.
 */
export default function AdminAutoRefresh() {
  const router = useRouter();
  const pathname = usePathname();
  const lastRefreshTimeRef = useRef<number>(Date.now());

  const isEditingOrCreating = pathname.includes("/edit") || pathname.includes("/new");

  useEffect(() => {
    const throttledRefresh = () => {
      const now = Date.now();
      // Throttle focus/visibility refreshes to at most once every 10 seconds
      if (now - lastRefreshTimeRef.current > 10000) {
        lastRefreshTimeRef.current = now;
        router.refresh();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        throttledRefresh();
      }
    };

    const handleFocus = () => {
      throttledRefresh();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    // Periodic heartbeat every 25s when tab is active and not on an edit form
    let intervalId: NodeJS.Timeout | null = null;
    if (!isEditingOrCreating) {
      intervalId = setInterval(() => {
        if (document.visibilityState === "visible") {
          lastRefreshTimeRef.current = Date.now();
          router.refresh();
        }
      }, 25000);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      if (intervalId) clearInterval(intervalId);
    };
  }, [router, isEditingOrCreating]);

  return null;
}
