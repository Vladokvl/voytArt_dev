"use client";
import { useEffect, useMemo, useState, type ReactNode } from "react";
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

function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.innerWidth <= 899 ||
    window.matchMedia("(max-width: 899px)").matches ||
    window.matchMedia("(hover: none)").matches ||
    window.matchMedia("(pointer: coarse)").matches
  );
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Інстанс тримаємо в стані, щоб усі споживачі через LenisContext отримували його реактивно
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  useEffect(() => {
    const isMobile = isMobileViewport();
    const isHome = isHomePath(pathname);

    // На мобільних/планшетних пристроях плавний скрол активний ВИКЛЮЧНО на головній сторінці (для 3D Hero).
    // На всіх інших сторінках Lenis повністю знищується, забезпечуючи 100% нативний скрол.
    const shouldEnable = !isMobile || isHome;

    if (!shouldEnable) {
      if (window.__lenis) {
        window.__lenis.destroy();
        window.__lenis = undefined;
      }
      setLenisInstance(null);
      ScrollTrigger.refresh();
      return;
    }

    // GSAP керує Lenis через свій ticker — вони завжди в одному кадрі.
    gsap.ticker.lagSmoothing(0);

    const lenis = new Lenis({
      lerp: isMobile ? 0.15 : 0.1,
      smoothWheel: true,
      anchors: true,
    });

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
      setLenisInstance(null);
    };
  }, [pathname]);

  // При кожній зміні маршруту гарантовано скидаємо скрол у 0 та перераховуємо розміри
  useEffect(() => {
    window.scrollTo(0, 0);

    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true, force: true });
      lenisInstance.resize();
    }
    ScrollTrigger.refresh();

    // Додаткові таймери для сторінок, які довантажують зображення та DOM
    const rafId = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { immediate: true, force: true });
        lenisInstance.resize();
      }
      ScrollTrigger.refresh();
    });

    const t1 = setTimeout(() => {
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { immediate: true, force: true });
        lenisInstance.resize();
      }
      ScrollTrigger.refresh();
    }, 50);

    const t2 = setTimeout(() => {
      if (lenisInstance) {
        lenisInstance.resize();
      }
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, lenisInstance]);

  const providerValue = useMemo(() => lenisInstance, [lenisInstance]);

  return (
    <LenisProvider lenis={providerValue}>{children}</LenisProvider>
  );
}