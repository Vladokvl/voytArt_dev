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
    window.__lenis = lenis;

    const driverFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(driverFn);

    lenis.on("scroll", () => ScrollTrigger.update());

    // Обробник стрілочки браузера "Назад/Вперед"
    const handlePopState = () => {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true, force: true });
      lenis.resize();
      ScrollTrigger.refresh();

      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        lenis.scrollTo(0, { immediate: true, force: true });
        lenis.resize();
        ScrollTrigger.refresh();
      });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      gsap.ticker.remove(driverFn);
      lenis.destroy();
    };
  }, []);

  // При кожній зміні маршруту гарантовано скидаємо скрол у 0 та перераховуємо розміри
  useEffect(() => {
    window.scrollTo(0, 0);
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
      lenis.resize();
      ScrollTrigger.refresh();

      // Додаткові таймери для сторінок, які довантажують зображення та DOM
      const rafId = requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        lenis.scrollTo(0, { immediate: true, force: true });
        lenis.resize();
        ScrollTrigger.refresh();
      });

      const t1 = setTimeout(() => {
        lenis.scrollTo(0, { immediate: true, force: true });
        lenis.resize();
        ScrollTrigger.refresh();
      }, 50);

      const t2 = setTimeout(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      }, 200);

      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [pathname]);

  return <>{children}</>;
}