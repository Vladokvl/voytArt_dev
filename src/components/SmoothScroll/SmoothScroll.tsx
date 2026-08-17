"use client";
import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // GSAP керує Lenis через свій ticker — вони завжди в одному кадрі.
    gsap.ticker.lagSmoothing(0);

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      anchors: true,
    });

    // Expose lenis to window so we can control it on route transitions and modals
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    (window as any).lenis = lenis;

    const driverFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(driverFn);

    lenis.on("scroll", () => ScrollTrigger.update());

    return () => {
      gsap.ticker.remove(driverFn);
      lenis.destroy();
    };
  }, []);

  // При кожній зміні маршруту скидаємо скрол на 0 та оновлюємо розміри Lenis/GSAP
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    const lenis = (window as any).lenis as Lenis | undefined;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
      lenis.resize();
      ScrollTrigger.refresh();
    } else if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return <>{children}</>;
}