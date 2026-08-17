"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import LogoSection from "../Sections/LogoSection";
import AboutGallerySection from "../Sections/AboutGallerySection";
import ArtSection from "../Sections/ArtSection";
import ArtShopSection from "../Sections/ArtShopSection";
import NeonSection from "../Sections/NeonSection";
import styles from "./Hero.module.scss";

gsap.registerPlugin(ScrollTrigger, Observer);

// HeroDesktop — десктопна версія з frame-scrub hero.
const DESKTOP_TOTAL_FRAMES = 421;
const PRELOAD_CRITICAL_FRAMES = 14;
const PRELOAD_READY_THRESHOLD = 8;
const BUFFER_FORWARD = 36;
const BUFFER_BACKWARD = 8;
const HERO_READY_EVENT = "voyt:hero-ready";

// ╔══════════════════════════════════════════════════════════════════════╗
// ║  DESKTOP SNAP POINTS (Таймкоди / точки фіксації скролу)             ║
// ║                                                                      ║
// ║  Основне відео (від 0.0 до 1.0 висоти .container):                  ║
// ║    0.00 = Стартовий екран (LogoSection)                              ║
// ║    0.24 = Панель 0 — "About our Gallery" по центру                   ║
// ║    0.56 = Панель 1 — "Discover our Art" по центру                    ║
// ║    0.82 = Панель 2 — "Art shop" по центру                            ║
// ║    1.00 = Кінець основного відео (перехід на Neon)                   ║
// ║                                                                      ║
// ║  Неон-секція (окремий контейнер .neonContainer):                     ║
// ║    Neon = 0.50 — середина neon-контейнера (50% його висоти)          ║
// ║    Змінюй DESKTOP_NEON_SNAP нижче (0.0 = початок, 1.0 = кінець)     ║
// ║                                                                      ║
// ║  Змінюйте числа (від 0.0 до 1.0) для тонкого налаштування!          ║
// ╚══════════════════════════════════════════════════════════════════════╝
// 0.0 = Logo, 0.24 = About, 0.6 = Art, 0.9 = Art Shop, потім одразу Neon
const DESKTOP_SNAP_POINTS = [0.0, 0.24, 0.6, 0.9];
// ★ Де зупинитися всередині Neon-секції (0.0 = самий верх, 1.0 = самий низ)
const DESKTOP_NEON_SNAP = 0.9;
// ★ Швидкість / тривалість перельоту між секціями (у секундах)
// (Змінюй тут: 0.8 = швидше, 1.2 = плавно за замовчуванням, 1.6 = довше/кінематографічніше)
const DESKTOP_SNAP_DURATION = 1.2;

const getDesktopFrameSrc = (index: number) =>
  `/mainPageVideos/originals/desktop_frames/frame_${String(index).padStart(4, "0")}.webp`;

export default function HeroDesktop() {
  const [isMainReady, setIsMainReady] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [loaderHint, setLoaderHint] = useState("Preparing first frames");

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageCacheRef = useRef<Map<number, HTMLImageElement>>(new Map());
  const pendingLoadsRef = useRef<Set<number>>(new Set());
  const currentFrameRef = useRef(1);
  const frameTweenRef = useRef<gsap.core.Tween | null>(null);
  const prefetchAbortRef = useRef<AbortController | null>(null);
  const prefetchedFramesRef = useRef<Set<number>>(new Set());
  const prefetchStartedRef = useRef(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const panel0Ref = useRef<HTMLDivElement>(null);
  const panel1Ref = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);
  const panel0OverlayRef = useRef<HTMLDivElement>(null);
  const panel1OverlayRef = useRef<HTMLDivElement>(null);
  const panel2OverlayRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const neonContainerRef = useRef<HTMLDivElement>(null);
  const neonVideoRef = useRef<HTMLVideoElement>(null);
  const neonPanelRef = useRef<HTMLDivElement>(null);
  const neonOverlayRef = useRef<HTMLDivElement>(null);
  const targetIndexRef = useRef(0);
  const isGlidingRef = useRef(false);

  useEffect(() => {
    if (!isMainReady) return;

    const heroWindow = window as Window & { __voytHeroReady?: boolean };
    heroWindow.__voytHeroReady = true;
    window.dispatchEvent(
      new CustomEvent(HERO_READY_EVENT, {
        detail: { source: "desktop-frames" },
      }),
    );
  }, [isMainReady]);

  // useLayoutEffect — виставляємо початкові стани ДО першого рендеру
  // щоб уникнути "флеш" видимих панелей
  useLayoutEffect(() => {
    // ╔══════════════════════════════════════════════════════════════════════╗
    // ║  DESKTOP INITIAL POSITIONS                                          ║
    // ║  Змінюй x / y / opacity щоб налаштувати звідки виїжджають панелі  ║
    // ║  x: -80 = зліва,  x: 80 = справа,  y: 80 = знизу                 ║
    // ╚══════════════════════════════════════════════════════════════════════╝
    if (panel0Ref.current)
      gsap.set(panel0Ref.current, {
        opacity: 0,
        x: -80,
        pointerEvents: "none",
      }); // Panel 0: зліва
    if (panel1Ref.current)
      gsap.set(panel1Ref.current, {
        opacity: 0,
        x: -80,
        pointerEvents: "none",
      }); // Panel 1: зліва
    if (panel2Ref.current)
      gsap.set(panel2Ref.current, { opacity: 0, x: 80, pointerEvents: "none" }); // Panel 2: справа
    if (panel0OverlayRef.current)
      gsap.set(panel0OverlayRef.current, { opacity: 0, x: -120 });
    if (panel1OverlayRef.current)
      gsap.set(panel1OverlayRef.current, { opacity: 0, x: -120 });
    if (panel2OverlayRef.current)
      gsap.set(panel2OverlayRef.current, { opacity: 0, x: 120 });
    // Neon початкові стани
    if (curtainRef.current) gsap.set(curtainRef.current, { y: "100%" }); // ширма за нижнім краєм
    if (neonVideoRef.current) gsap.set(neonVideoRef.current, { opacity: 0 }); // neon відео невидиме
    if (neonPanelRef.current)
      gsap.set(neonPanelRef.current, {
        opacity: 0,
        x: -80,
        pointerEvents: "none",
      }); // neon панель
    if (neonOverlayRef.current)
      gsap.set(neonOverlayRef.current, { opacity: 0, x: -120 });
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    const panel0 = panel0Ref.current;
    const panel1 = panel1Ref.current;
    const panel2 = panel2Ref.current;
    const panel0Overlay = panel0OverlayRef.current;
    const panel1Overlay = panel1OverlayRef.current;
    const panel2Overlay = panel2OverlayRef.current;
    const bar = progressBarRef.current;

    if (!container || !canvas || !hero || !panel0 || !panel1 || !panel2) return;

    const ctx2d = canvas.getContext("2d", { alpha: false });
    if (!ctx2d) return;

    const imageCache = imageCacheRef.current;
    const pendingLoads = pendingLoadsRef.current;
    const prefetchedFrames = prefetchedFramesRef.current;

    const drawFrame = (frame: number) => {
      const img = imageCache.get(frame);
      if (!img || !img.complete || img.naturalWidth === 0 || img.naturalHeight === 0)
        return;

      const canvasW = canvas.width;
      const canvasH = canvas.height;
      const scale = Math.max(canvasW / img.naturalWidth, canvasH / img.naturalHeight);
      const drawW = img.naturalWidth * scale;
      const drawH = img.naturalHeight * scale;
      const offsetX = (canvasW - drawW) / 2;
      const offsetY = (canvasH - drawH) / 2;

      ctx2d.clearRect(0, 0, canvasW, canvasH);
      ctx2d.drawImage(img, offsetX, offsetY, drawW, drawH);
    };

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(window.innerWidth));
      const height = Math.max(1, Math.floor(window.innerHeight));

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      drawFrame(currentFrameRef.current);
    };

    const loadFrame = (frame: number, onSettled?: () => void) => {
      if (frame < 1 || frame > DESKTOP_TOTAL_FRAMES) return;

      const cached = imageCache.get(frame);
      if (cached) {
        onSettled?.();
        return;
      }

      if (pendingLoads.has(frame)) return;
      pendingLoads.add(frame);

      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        pendingLoads.delete(frame);
        imageCache.set(frame, img);
        onSettled?.();

        if (frame === currentFrameRef.current) {
          drawFrame(frame);
        }
      };
      img.onerror = () => {
        pendingLoads.delete(frame);
        onSettled?.();
      };
      img.src = getDesktopFrameSrc(frame);
    };

    const manageCache = (currentFrame: number) => {
      const startWindow = Math.max(1, currentFrame - BUFFER_BACKWARD);
      const endWindow = Math.min(DESKTOP_TOTAL_FRAMES, currentFrame + BUFFER_FORWARD);

      for (let frame = startWindow; frame <= endWindow; frame += 1) {
        loadFrame(frame);
      }

      for (const frame of imageCache.keys()) {
        if (frame < startWindow || frame > endWindow) {
          const img = imageCache.get(frame);
          if (img) {
            img.src = "";
          }
          imageCache.delete(frame);
        }
      }
    };

    const prefetchFramesInBackground = async (startFromFrame: number) => {
      if (prefetchStartedRef.current) return;

      const connection = (navigator as Navigator & {
        connection?: { saveData?: boolean };
      }).connection;
      if (connection?.saveData) return;

      prefetchStartedRef.current = true;
      const controller = new AbortController();
      prefetchAbortRef.current = controller;

      for (let frame = startFromFrame; frame <= DESKTOP_TOTAL_FRAMES; frame += 1) {
        if (controller.signal.aborted) break;
        if (prefetchedFrames.has(frame)) continue;

        try {
          const response = await fetch(getDesktopFrameSrc(frame), {
            cache: "force-cache",
            signal: controller.signal,
          });
          if (response.ok) {
            await response.blob();
            prefetchedFrames.add(frame);
          }
        } catch {
          break;
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Neon refs (перевіряються окремо всередині контексту — основні анімації працюють навіть без них)
    const neonContainer = neonContainerRef.current;
    const neonVideo = neonVideoRef.current;
    const neonPanel = neonPanelRef.current;
    const neonOverlay = neonOverlayRef.current;
    const curtain = curtainRef.current;

    // Прогрес-бар охоплює основний (800vh) + neon (400vh) = 1200vh разом
    // ↓↓ Онови якщо змінюєш висоту .container або .neonContainer в CSS
    const MAIN_PROGRESS_FRAC = 800 / 1000;
    const NEON_PROGRESS_FRAC = 200 / 1000;

    const initDesktopFrameScroll = () => {
      frameTweenRef.current?.kill();

      const frameState = { frame: 1 };
      let lastRenderedFrame = 1;

      manageCache(1);
      drawFrame(1);

      frameTweenRef.current = gsap.to(frameState, {
        frame: DESKTOP_TOTAL_FRAMES,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (self) => {
            if (bar)
              bar.style.width = `${self.progress * MAIN_PROGRESS_FRAC * 100}%`;

            const currentFrame = Math.round(frameState.frame);
            if (currentFrame !== lastRenderedFrame) {
              currentFrameRef.current = currentFrame;
              manageCache(currentFrame);
              drawFrame(currentFrame);
              lastRenderedFrame = currentFrame;
            }
          },
        },
      });
    };

    let settledCritical = 0;
    let loadedCritical = 0;
    let frameScrollInitialized = false;

    for (let frame = 1; frame <= PRELOAD_CRITICAL_FRAMES; frame += 1) {
      loadFrame(frame, () => {
        settledCritical += 1;
        if (frame === 1) {
          currentFrameRef.current = 1;
          drawFrame(1);
        }

        loadedCritical += 1;
        setLoaderProgress(
          Math.min(100, Math.round((settledCritical / PRELOAD_CRITICAL_FRAMES) * 100)),
        );
        setLoaderHint(
          `Loaded ${Math.min(loadedCritical, PRELOAD_CRITICAL_FRAMES)} of ${PRELOAD_CRITICAL_FRAMES}`,
        );

        if (
          !frameScrollInitialized &&
          loadedCritical >= PRELOAD_READY_THRESHOLD
        ) {
          frameScrollInitialized = true;
          setIsMainReady(true);
          initDesktopFrameScroll();
          window.setTimeout(() => {
            void prefetchFramesInBackground(PRELOAD_CRITICAL_FRAMES + 1);
          }, 1000);
        }
      });
    }

    const ctx = gsap.context(() => {
      // ── 0. Hero parallax ────────────────────────────────────────────────
      // ╔══════════════════════════════════════════════════════════════════╗
      // ║  DESKTOP HERO PARALLAX                                          ║
      // ║  yPercent: -100 → піднімається вгору на всю висоту секції      ║
      // ║  Змінюй yPercent (напрямок/відстань) та scrub (інерція)        ║
      // ╚══════════════════════════════════════════════════════════════════╝
      gsap.to(hero, {
        yPercent: -100, // ← напрямок: негативне = вгору
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.6, // ← інерція: 0.1 = жорстко, 2 = дуже плавно
        },
      });

      // ── 2. Panel 0: "About our Gallery" ─────────────────────────────
      // ╔══════════════════════════════════════════════════════════════════╗
      // ║  DESKTOP PANEL 0 TIMINGS                                        ║
      // ║  start/end: % висоти контейнера (.container) де панель видима  ║
      // ║  Змінюй x (напрямок) та scrub (інерція)                        ║
      // ║  Змінюй 0.65 → де починає зникати (0 = одразу, 1 = наприкінці)║
      // ╚══════════════════════════════════════════════════════════════════╝
      const tl0 = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "13% top", // ← коли з'являється (2% висоти container = top viewport)
          end: "35% top", // ← коли зникає
          scrub: 0.8,
          // вмикаємо pointer-events коли панель в межах відрізку скролу
          onEnter: () => {
            panel0.style.pointerEvents = "auto";
          },
          onLeave: () => {
            panel0.style.pointerEvents = "none";
          },
          onEnterBack: () => {
            panel0.style.pointerEvents = "auto";
          },
          onLeaveBack: () => {
            panel0.style.pointerEvents = "none";
          },
        },
      });
      tl0
        .fromTo(
          [panel0, panel0Overlay],
          { opacity: 0, x: -100 }, // ← зліва
          { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" },
        )
        .to(
          [panel0, panel0Overlay],
          { opacity: 0, x: -100, duration: 0.35, ease: "power2.in" }, // ← іде вліво
          0.65, // ← старт зникнення: 65% відрізку
        );

      // ── 3. Panel 1: "Discover our Art" ──────────────────────────────
      // ╔══════════════════════════════════════════════════════════════════╗
      // ║  DESKTOP PANEL 1 TIMINGS                                        ║
      // ║  Змінюй start/end (коли видима), x (напрямок), scrub (інерція) ║
      // ╚══════════════════════════════════════════════════════════════════╝
      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "47% top", // ← коли з'являється
          end: "65% top", // ← коли зникає
          scrub: 0.8,
          onEnter: () => {
            panel1.style.pointerEvents = "auto";
          },
          onLeave: () => {
            panel1.style.pointerEvents = "none";
          },
          onEnterBack: () => {
            panel1.style.pointerEvents = "auto";
          },
          onLeaveBack: () => {
            panel1.style.pointerEvents = "none";
          },
        },
      });
      tl1
        .fromTo(
          [panel1, panel1Overlay],
          { opacity: 0, x: -100 }, // ← зліва
          { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" },
        )
        .to(
          [panel1, panel1Overlay],
          { opacity: 0, x: -100, duration: 0.35, ease: "power2.in" },
          0.65,
        );

      // ── 4. Panel 2: "Art shop" ───────────────────────────────────────
      // ╔══════════════════════════════════════════════════════════════════╗
      // ║  DESKTOP PANEL 2 TIMINGS                                        ║
      // ║  Виїжджає справа (позитивний x = справа)                       ║
      // ║  Змінюй start/end, x (напрямок), scrub (інерція)               ║
      // ╚══════════════════════════════════════════════════════════════════╝
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "70% top", // ← коли з'являється
          end: "94% top", // ← коли зникає
          scrub: 0.8,
          onEnter: () => {
            panel2.style.pointerEvents = "auto";
          },
          onLeave: () => {
            panel2.style.pointerEvents = "none";
          },
          onEnterBack: () => {
            panel2.style.pointerEvents = "auto";
          },
          onLeaveBack: () => {
            panel2.style.pointerEvents = "none";
          },
        },
      });
      tl2
        .fromTo(
          [panel2, panel2Overlay],
          { opacity: 0, x: 100 }, // ← справа
          { opacity: 1, x: 0, duration: 0.35, ease: "power2.out" },
        )
        .to(
          [panel2, panel2Overlay],
          { opacity: 0, x: 100, duration: 0.35, ease: "power2.in" },
          0.65,
        );

      // ══════════════════════════════════════════════════════════════════════
      // NEON SECTION TRANSITION
      // ══════════════════════════════════════════════════════════════════════
      if (neonContainer && neonVideo && neonPanel && neonOverlay && curtain) {
        // ── Прогрес-бар для neon секції ────────
        ScrollTrigger.create({
          trigger: neonContainer,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
          onUpdate: (self) => {
            if (bar)
              bar.style.width = `${(MAIN_PROGRESS_FRAC + self.progress * NEON_PROGRESS_FRAC) * 100}%`;
          },
        });

        // ── Curtain: виїжджає знизу вгору наприкінці основного відео ────────────────
        // ╔══════════════════════════════════════════════════════════════════════╗
        // ║  DESKTOP CURTAIN TIMING                                          ║
        // ║  start: коли ширма починає підніматися (% основного container)  ║
        // ║  end:   коли ширма повністю закриває екран                   ║
        // ╚══════════════════════════════════════════════════════════════════════╝
        gsap.to(curtain, {
          y: "0%",
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "80% top", // ← ширма починає підиматися
            end: "100% top", // ← ширма повністю закриває екран
            scrub: 0.8,
          },
        });

        // ── Neon відео: проявляється під ширмою ─────────────────────────
        // ╔══════════════════════════════════════════════════════════════════════╗
        // ║  DESKTOP NEON VIDEO FADE                                         ║
        // ║  start/end відносно neonContainer (400vh блок)               ║
        // ╚══════════════════════════════════════════════════════════════════════╝
        gsap.fromTo(
          neonVideo,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: neonContainer,
              start: "0% top", // ← відразу з початку neon контейнера
              end: "20% top", // ← повністю видиме на 20%
              scrub: 0.8,
              onEnter: () => {
                void neonVideo.play();
              }, // ← явний play на Chrome PC
            },
          },
        );

        // ── NeonSection panel: виїжджає зліва ──────────────────────────────
        // ╔══════════════════════════════════════════════════════════════════════╗
        // ║  DESKTOP NEON PANEL TIMINGS                                      ║
        // ║  start/end відносно neonContainer                              ║
        // ║  x: -80 = зліва (змінюй напрямок як для інших панелей)     ║
        // ╚══════════════════════════════════════════════════════════════════════╝
        const tlNeon = gsap.timeline({
          scrollTrigger: {
            trigger: neonContainer,
            start: "20% top", // ← панель з'являється
            end: "85% top", // ← панель зникає
            scrub: 0.8,
            onEnter: () => {
              neonPanel.style.pointerEvents = "auto";
            },
            onLeave: () => {
              neonPanel.style.pointerEvents = "none";
            },
            onEnterBack: () => {
              neonPanel.style.pointerEvents = "auto";
            },
            onLeaveBack: () => {
              neonPanel.style.pointerEvents = "none";
            },
          },
        });
        tlNeon
          .fromTo(
            [neonPanel, neonOverlay],
            { opacity: 0, x: -100 }, // ← зліва
            { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" },
          )
          .to(
            [neonPanel, neonOverlay],
            { opacity: 0, x: -100, duration: 0.3, ease: "power2.in" },
            0.7,
          );
      }
    }, containerRef);

    // ══════════════════════════════════════════════════════════════════════
    // INTENT-DRIVEN SECTION GLIDER (Direct Wheel & Touch Interceptors)
    // ══════════════════════════════════════════════════════════════════════
    const updateTargetFromScroll = () => {
      if (isGlidingRef.current) return;
      const neonEl = neonContainerRef.current;
      const mainMaxScroll = container.offsetHeight - window.innerHeight;

      // Якщо користувач уже в зоні Neon секції — ставимо індекс Neon
      if (neonEl) {
        const neonRect = neonEl.getBoundingClientRect();
        const neonAbsTop = neonRect.top + window.scrollY;
        if (window.scrollY >= neonAbsTop - 50) {
          targetIndexRef.current = DESKTOP_SNAP_POINTS.length;
          return;
        }
      }

      if (mainMaxScroll <= 0) return;
      const rawProgress = window.scrollY / mainMaxScroll;
      const clamped = Math.max(0, Math.min(1, rawProgress));

      let closest = 0;
      let minDiff = Infinity;
      for (let i = 0; i < DESKTOP_SNAP_POINTS.length; i++) {
        const diff = Math.abs(DESKTOP_SNAP_POINTS[i] - clamped);
        if (diff < minDiff) {
          minDiff = diff;
          closest = i;
        }
      }
      targetIndexRef.current = closest;
    };

    window.addEventListener("scroll", updateTargetFromScroll, { passive: true });

    const goToSection = (index: number) => {
      // index === DESKTOP_SNAP_POINTS.length означає Neon-секцію
      const isNeon = index >= DESKTOP_SNAP_POINTS.length;
      const clamped = isNeon
        ? DESKTOP_SNAP_POINTS.length
        : Math.max(0, Math.min(DESKTOP_SNAP_POINTS.length - 1, index));
      targetIndexRef.current = clamped;
      isGlidingRef.current = true;

      let targetY: number;
      const neonEl = neonContainerRef.current;

      if (isNeon && neonEl) {
        // ──── Neon: скролимо до позиції всередині neonContainer ────
        const neonRect = neonEl.getBoundingClientRect();
        const neonAbsTop = neonRect.top + window.scrollY;
        const neonMaxScroll = neonEl.offsetHeight - window.innerHeight;
        const neonOffset = neonAbsTop + Math.max(0, neonMaxScroll) * DESKTOP_NEON_SNAP;
        targetY = neonOffset;
      } else {
        // ──── Основне відео ────
        const progress = DESKTOP_SNAP_POINTS[clamped];
        const maxScroll = container.offsetHeight - window.innerHeight;
        targetY = progress * maxScroll;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      const lenis = (window as any).lenis;
      if (lenis) {
        // Зупиняємо Lenis, щоб він не перебивав наш scrollTo
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        lenis.stop();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        lenis.scrollTo(targetY, {
          duration: DESKTOP_SNAP_DURATION,
          force: true,
          lock: true,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          onComplete: () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
            lenis.start();
            isGlidingRef.current = false;
          },
        });
      } else {
        window.scrollTo({ top: targetY, behavior: "smooth" });
        setTimeout(() => {
          isGlidingRef.current = false;
        }, DESKTOP_SNAP_DURATION * 1000);
      }
    };

    const TOTAL_SECTIONS = DESKTOP_SNAP_POINTS.length + 1; // +1 для Neon

    const handleHeroWheel = (e: WheelEvent) => {
      const neonEl = neonContainerRef.current;
      const mainMaxScroll = container.offsetHeight - window.innerHeight;
      const neonRect = neonEl?.getBoundingClientRect();
      const neonAbsTop = neonRect ? neonRect.top + window.scrollY : mainMaxScroll;
      const neonMaxScroll = neonEl ? Math.max(0, neonEl.offsetHeight - window.innerHeight) : 0;
      const neonTargetY = neonAbsTop + neonMaxScroll * DESKTOP_NEON_SNAP;
      const neonBottom = neonAbsTop + (neonEl ? neonEl.offsetHeight : 0);

      // Якщо користувач вже на/після Neon і крутить ВНИЗ -> відпускаємо до футера!
      if (window.scrollY >= neonTargetY - 15 && e.deltaY > 0) {
        return;
      }

      // Якщо користувач перебуває у футері та скролить вгору, поки не дійде до Neon -> не перехоплюємо
      if (window.scrollY > neonBottom - window.innerHeight + 20 && e.deltaY < 0) {
        return;
      }

      // Якщо поза межами hero + neon
      if (window.scrollY > neonBottom) return;

      // Блокуємо паразитні мікро-рухи під час перельоту
      if (isGlidingRef.current) {
        e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaY) < 8) return;

      // Скрол ВНИЗ -> до наступної секції (включно з Neon)
      if (e.deltaY > 0 && targetIndexRef.current < TOTAL_SECTIONS - 1) {
        e.preventDefault();
        goToSection(targetIndexRef.current + 1);
        return;
      }
      // Скрол ВГОРУ -> до попередньої секції
      if (e.deltaY < 0 && targetIndexRef.current > 0) {
        e.preventDefault();
        goToSection(targetIndexRef.current - 1);
        return;
      }
    };

    let touchStartY = 0;
    const handleHeroTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0]?.clientY ?? 0;
    };
    const handleHeroTouchMove = (e: TouchEvent) => {
      const neonEl = neonContainerRef.current;
      const mainMaxScroll = container.offsetHeight - window.innerHeight;
      const neonRect = neonEl?.getBoundingClientRect();
      const neonAbsTop = neonRect ? neonRect.top + window.scrollY : mainMaxScroll;
      const neonMaxScroll = neonEl ? Math.max(0, neonEl.offsetHeight - window.innerHeight) : 0;
      const neonTargetY = neonAbsTop + neonMaxScroll * DESKTOP_NEON_SNAP;
      const neonBottom = neonAbsTop + (neonEl ? neonEl.offsetHeight : 0);

      const touchY = e.touches[0]?.clientY ?? 0;
      const deltaY = touchStartY - touchY;

      // Свайп вгору (рух вниз до футера після Neon) -> відпускаємо
      if (window.scrollY >= neonTargetY - 15 && deltaY > 0) {
        return;
      }

      if (window.scrollY > neonBottom - window.innerHeight + 20 && deltaY < 0) {
        return;
      }

      if (window.scrollY > neonBottom) return;

      if (isGlidingRef.current) {
        e.preventDefault();
        return;
      }

      if (Math.abs(deltaY) > 25) {
        if (deltaY > 0 && targetIndexRef.current < TOTAL_SECTIONS - 1) {
          e.preventDefault();
          touchStartY = touchY;
          goToSection(targetIndexRef.current + 1);
        } else if (deltaY < 0 && targetIndexRef.current > 0) {
          e.preventDefault();
          touchStartY = touchY;
          goToSection(targetIndexRef.current - 1);
        }
      }
    };

    window.addEventListener("wheel", handleHeroWheel, { passive: false });
    window.addEventListener("touchstart", handleHeroTouchStart, { passive: true });
    window.addEventListener("touchmove", handleHeroTouchMove, { passive: false });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", updateTargetFromScroll);
      window.removeEventListener("wheel", handleHeroWheel);
      window.removeEventListener("touchstart", handleHeroTouchStart);
      window.removeEventListener("touchmove", handleHeroTouchMove);

      for (const img of imageCache.values()) {
        img.src = "";
      }
      imageCache.clear();
      pendingLoads.clear();
      frameTweenRef.current?.kill();
      frameTweenRef.current = null;
      prefetchAbortRef.current?.abort();
      prefetchAbortRef.current = null;
      prefetchedFrames.clear();
      prefetchStartedRef.current = false;

      ctx.revert();
    };
  }, []);

  return (
    <>
      {/* ══ Fixed HUD — поза всіма scroll-контейнерами, жодна GSAP-анімація не зачіпає ══ */}
      <div className={styles.fixedHud}>
        {/* Scroll-підказка */}
        <div className={styles.scrollHint}>
          <span>scroll</span>
          <div className={styles.scrollLine} />
        </div>
        {/* Прогрес-бар */}
        <div className={styles.progressTrack}>
          <div ref={progressBarRef} className={styles.progressBar} />
        </div>
      </div>

      <div ref={containerRef} className={styles.container}>
        <div className={styles.sticky}>
          {!isMainReady && (
            <div className={styles.heroLoader}>
              <p className={styles.heroLoaderTitle}>Loading Desktop Frames</p>
              <p className={styles.heroLoaderProgress}>{loaderProgress}%</p>
              <div className={styles.heroLoaderTrack}>
                <div
                  className={styles.heroLoaderFill}
                  style={{ width: `${loaderProgress}%` }}
                />
              </div>
              <p className={styles.heroLoaderMeta}>{loaderHint}</p>
            </div>
          )}

          {/* Десктоп hero через canvas-фрейми з керованим кешем у RAM */}
          <canvas
            ref={canvasRef}
            className={styles.video}
            data-video="mainDesktop"
          />

          {/* Hero: логотип та назва галереї */}
          <div className={styles.aboutWrap}>
            <LogoSection ref={heroRef} />
          </div>

          {/* Panel 0 — "About our gallery" (зліва) */}
          <div
            ref={panel0OverlayRef}
            className={`${styles.panelOverlay} ${styles.panelOverlayLeft}`}
          />
          <div ref={panel0Ref} className={styles.panel}>
            <AboutGallerySection />
          </div>

          {/* Panel 1 — "Discover our art" (зліва) */}
          <div
            ref={panel1OverlayRef}
            className={`${styles.panelOverlay} ${styles.panelOverlayLeft}`}
          />
          <div ref={panel1Ref} className={styles.panel}>
            <ArtSection />
          </div>

          {/* Panel 2 — "Art shop" (справа) */}
          <div
            ref={panel2OverlayRef}
            className={`${styles.panelOverlay} ${styles.panelOverlayRight}`}
          />
          <div
            ref={panel2Ref}
            className={`${styles.panel} ${styles.panelRight}`}
          >
            <ArtShopSection />
          </div>

          {/* Ширма — виїжджає знизу вгору наприкінці основного відео */}
          <div ref={curtainRef} className={styles.curtain} />
        </div>
      </div>

      {/* ══ Neon section ════════════════════════════════════════════════════ */}
      {/* ↓↓ NEON CONTAINER HEIGHT — змінюй в Hero.module.scss (.neonContainer) */}
      <div ref={neonContainerRef} className={styles.neonContainer}>
        <div className={`${styles.sticky} ${styles.stickyDark}`}>
          {/* Neon відео — looping atmosphere (grays out until curtain reveals it) */}
          {/* ↓↓ Змінюй src для іншого neon відео */}
          <video
            ref={neonVideoRef}
            className={styles.video}
            src="/mainPageVideos/final_neon_desktop.mp4"
            muted
            loop
            autoPlay
            playsInline
            preload="auto"
          />

          {/* Neon панель — з'являється після відкриття ширми */}
          <div
            ref={neonOverlayRef}
            className={`${styles.panelOverlay} ${styles.panelOverlayLeft}`}
          />
          <div ref={neonPanelRef} className={styles.panel}>
            <NeonSection />
          </div>
        </div>
      </div>
    </>
  );
}
