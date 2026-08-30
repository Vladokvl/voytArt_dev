"use client";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LenisProvider } from "~/context/LenisContext";

gsap.registerPlugin(ScrollTrigger);

function isHomePath(path: string | null): boolean {
  if (!path) return true;
  const clean = path.replace(/\/+$/, "");
  return clean === "" || clean === "/uk" || clean === "/en";
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Інстанс тримаємо в стані, щоб усі споживачі через LenisContext отримували його реактивно
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // 1. Ініціалізація Lenis один раз при монтуванні (фіксований масив залежностей [])
  useEffect(() => {
    // GSAP керує Lenis через свій ticker — вони завжди в одному кадрі.
    gsap.ticker.lagSmoothing(0);

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      anchors: true,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);
    // Залишено для backward-compat / дебагу в консолі — новий код має використовувати useLenis()
    window.__lenis = lenis;

    const driverFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(driverFn);

    lenis.on("scroll", () => ScrollTrigger.update());

    // Обробник стрілочки браузера "Назад/Вперед"
    const handlePopState = () => {
      lenis.resize();
      ScrollTrigger.refresh();

      requestAnimationFrame(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      gsap.ticker.remove(driverFn);
      lenis.destroy();
      if (window.__lenis === lenis) window.__lenis = undefined;
      lenisRef.current = null;
      setLenisInstance(null);
    };
  }, []);

  // 2. Керування станом скролу при зміні маршруту: на мобільному Lenis активний лише на головній
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    const isTouchOrMobile =
      typeof window !== "undefined" &&
      (window.matchMedia("(max-width: 768px)").matches ||
        window.matchMedia("(hover: none) and (pointer: coarse)").matches);

    const isHome = isHomePath(pathname);

    // На мобільних поза головною сторінкою повністю зупиняємо Lenis для нативного тач-скролу
    if (isTouchOrMobile && !isHome) {
      lenis.stop();
    } else {
      lenis.start();
    }

    window.scrollTo(0, 0);
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
  }, [pathname]);

  const providerValue = useMemo(() => lenisInstance, [lenisInstance]);

  return (
    <LenisProvider lenis={providerValue}>{children}</LenisProvider>
  );
}