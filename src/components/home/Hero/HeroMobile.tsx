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
import { getMobileFrameUrl, MOBILE_NEON_VIDEO_URL } from "~/data/framesManifest";
import { getFrameStride, snapFrameToStride } from "~/utils/adaptiveQuality";
import styles from "./Hero.module.scss";
import { useTranslation } from "~/context/LanguageContext";

gsap.registerPlugin(ScrollTrigger, Observer);

// HeroMobile — мобільна/планшет версія з frame-scrub hero.
const MOBILE_TOTAL_FRAMES = 466;
const MOBILE_PRELOAD_CRITICAL_FRAMES = 14;
const MOBILE_PRELOAD_READY_THRESHOLD = 8;
const HERO_READY_EVENT = "voyt:hero-ready";

// ╔══════════════════════════════════════════════════════════════════════╗
// ║  MOBILE SNAP POINTS (Таймкоди / точки фіксації скролу для мобайлу)  ║
// ║                                                                      ║
// ║  Основне відео (від 0.0 до 1.0 висоти .container):                  ║
// ║    0.00 = Стартовий екран (LogoSection)                              ║
// ║    0.25 = Панель 0 — "About our Gallery" по центру                   ║
// ║    0.60 = Панель 1 — "Discover our Art" по центру                    ║
// ║    0.90 = Панель 2 — "Art shop" по центру                            ║
// ║    1.00 = Кінець основного відео (перехід на Neon)                   ║
// ║                                                                      ║
// ║  Неон-секція (окремий контейнер .neonContainer):                     ║
// ║    Neon = 0.40 — де зупинитися всередині neon-контейнера            ║
// ║    Змінюй MOBILE_NEON_SNAP нижче (0.0 = початок, 1.0 = кінець)       ║
// ║                                                                      ║
// ║  Змінюйте числа (від 0.0 до 1.0) для тонкого налаштування!          ║
// ╚══════════════════════════════════════════════════════════════════════╝
// 0.0 = Logo, 0.25 = About, 0.60 = Art, 0.90 = Art Shop, потім одразу Neon
const MOBILE_SNAP_POINTS = [0.0, 0.25, 0.72, 0.98];
// ★ Де зупинитися всередині Neon-секції (0.0 = самий верх, 1.0 = самий низ)
const MOBILE_NEON_SNAP = 0.9;
// ★ Швидкість / тривалість перельоту між секціями (у секундах)
// (Змінюй тут: 1.5 = швидше, 2.0 = стандарт, 2.8 = довше/плавніше, 3.5 = кінематографічніше)
const MOBILE_SNAP_DURATION = 2;

export default function HeroMobile() {
  const { t } = useTranslation();
  const [isMainReady, setIsMainReady] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [loaderTitle, setLoaderTitle] = useState("Loading Mobile Frames");
  const [loaderHint, setLoaderHint] = useState("Preparing first frames");

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageCacheRef = useRef<Map<number, ImageBitmap | HTMLImageElement>>(new Map());
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
  const bufferBarRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const neonContainerRef = useRef<HTMLDivElement>(null);
  const neonVideoRef = useRef<HTMLVideoElement>(null);
  const neonPanelRef = useRef<HTMLDivElement>(null);
  const neonOverlayRef = useRef<HTMLDivElement>(null);
  const targetIndexRef = useRef(0);
  const isGlidingRef = useRef(false);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMainReady) return;

    const heroWindow = window as Window & { __voytHeroReady?: boolean };
    heroWindow.__voytHeroReady = true;
    try {
      sessionStorage.setItem("voyt_hero_cached", "true");
    } catch {
      // ignore
    }
    window.dispatchEvent(
      new CustomEvent(HERO_READY_EVENT, {
        detail: { source: "mobile-frames" },
      }),
    );
  }, [isMainReady]);

  // useLayoutEffect — виставляємо початкові стани ДО першого рендеру
  useLayoutEffect(() => {
    // ╔══════════════════════════════════════════════════════════════════════╗
    // ║  MOBILE INITIAL POSITIONS                                           ║
    // ║  Змінюй y / x / opacity щоб налаштувати звідки виїжджають панелі  ║
    // ║  y: 80 = знизу,  y: -80 = зверху,  x: -80 = зліва                ║
    // ╚══════════════════════════════════════════════════════════════════════╝
    if (panel0Ref.current) gsap.set(panel0Ref.current, { opacity: 0, y: 80, pointerEvents: "none" }); // Panel 0: знизу
    if (panel1Ref.current) gsap.set(panel1Ref.current, { opacity: 0, y: 80, pointerEvents: "none" }); // Panel 1: знизу
    if (panel2Ref.current) gsap.set(panel2Ref.current, { opacity: 0, y: 80, pointerEvents: "none" }); // Panel 2: знизу
    if (panel0OverlayRef.current) gsap.set(panel0OverlayRef.current, { opacity: 0, y: 110 });
    if (panel1OverlayRef.current) gsap.set(panel1OverlayRef.current, { opacity: 0, y: 110 });
    if (panel2OverlayRef.current) gsap.set(panel2OverlayRef.current, { opacity: 0, y: 110 });
    // Neon початкові стани
    if (curtainRef.current)   gsap.set(curtainRef.current,   { y: "100%" });                                      // ширма за нижнім краєм
    if (neonVideoRef.current) gsap.set(neonVideoRef.current, { opacity: 0 });                                     // neon відео невидиме
    if (neonPanelRef.current) gsap.set(neonPanelRef.current, { opacity: 0, y: 80, pointerEvents: "none" });       // neon панель
    if (neonOverlayRef.current) gsap.set(neonOverlayRef.current, { opacity: 0, y: 110 });
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
    const bufferBar = bufferBarRef.current;
    const neonVideo = neonVideoRef.current;

    const frameStride = getFrameStride();
    const TOTAL_STRIDED_FRAMES = Math.ceil(MOBILE_TOTAL_FRAMES / frameStride);

    // Прогрес-бар охоплює основний (800vh) + neon (400vh) = 1200vh разом
    const MAIN_PROGRESS_FRAC = 800 / 1200;
    const NEON_PROGRESS_FRAC = 400 / 1200;
    let neonBufferedFraction = 0;

    const updateBufferProgress = () => {
      if (bufferBar) {
        const framesFrac =
          (Math.min(TOTAL_STRIDED_FRAMES, prefetchedFrames.size) / TOTAL_STRIDED_FRAMES) *
          MAIN_PROGRESS_FRAC;
        const neonFrac = neonBufferedFraction * NEON_PROGRESS_FRAC;
        const total = Math.min(1, framesFrac + neonFrac);
        bufferBar.style.transform = `scaleX(${total})`;
      }
    };

    // Відстежуємо буферизацію neon-відео для 100% заповнення сірого бару
    const checkNeonBuffer = () => {
      if (!neonVideo) return;
      if (neonVideo.readyState >= 3) {
        neonBufferedFraction = 1;
        updateBufferProgress();
      } else if (neonVideo.buffered && neonVideo.buffered.length > 0 && neonVideo.duration > 0) {
        const end = neonVideo.buffered.end(neonVideo.buffered.length - 1);
        neonBufferedFraction = Math.min(1, end / neonVideo.duration);
        updateBufferProgress();
      }
    };

    neonVideo?.addEventListener("progress", checkNeonBuffer);
    neonVideo?.addEventListener("canplaythrough", () => {
      neonBufferedFraction = 1;
      updateBufferProgress();
    });
    neonVideo?.addEventListener("loadeddata", checkNeonBuffer);
    checkNeonBuffer();

    const drawFrame = (frame: number) => {
      const targetFrame = snapFrameToStride(frame, frameStride, MOBILE_TOTAL_FRAMES);
      const item = imageCache.get(targetFrame);
      if (!item) return;

      const canvasW = canvas.width;
      const canvasH = canvas.height;
      const imgW = "naturalWidth" in item ? item.naturalWidth : item.width;
      const imgH = "naturalHeight" in item ? item.naturalHeight : item.height;
      if (!imgW || !imgH) return;

      const scale = Math.max(canvasW / imgW, canvasH / imgH);
      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const offsetX = (canvasW - drawW) / 2;
      const offsetY = (canvasH - drawH) / 2;

      ctx2d.drawImage(item, offsetX, offsetY, drawW, drawH);
    };

    // Рендеринг напряму у поточному тіку анімації (без зайвої затримки double-RAF)
    const scheduleDraw = (frame: number) => {
      drawFrame(frame);
    };

    let lastWidth = 0;
    let lastHeight = 0;

    const resizeCanvas = () => {
      const rawDpr = window.devicePixelRatio || 1;
      const dpr = Math.min(rawDpr, 1.25);
      const width = Math.max(1, Math.floor(window.innerWidth));
      const height = Math.max(1, Math.floor(window.innerHeight));

      if (width === lastWidth && Math.abs(height - lastHeight) < 4 && lastWidth > 0) {
        return;
      }

      lastWidth = width;
      lastHeight = height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.position = "absolute";
      canvas.style.inset = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";

      drawFrame(currentFrameRef.current);
    };

    const loadFrame = (rawFrame: number, onSettled?: (ok: boolean) => void) => {
      const frame = snapFrameToStride(rawFrame, frameStride, MOBILE_TOTAL_FRAMES);
      if (frame < 1 || frame > MOBILE_TOTAL_FRAMES) return;

      const cached = imageCache.get(frame);
      if (cached) {
        onSettled?.(true);
        return;
      }

      if (pendingLoads.has(frame)) return;
      pendingLoads.add(frame);

      const img = new Image();
      img.decoding = "async";
      img.src = getMobileFrameUrl(frame);

      if (img.complete && img.naturalWidth > 0) {
        pendingLoads.delete(frame);
        imageCache.set(frame, img);
        prefetchedFrames.add(frame);
        updateBufferProgress();
        onSettled?.(true);
        if (frame === currentFrameRef.current) {
          scheduleDraw(frame);
        }
        return;
      }

      img.onload = () => {
        pendingLoads.delete(frame);
        imageCache.set(frame, img);
        prefetchedFrames.add(frame);
        updateBufferProgress();
        onSettled?.(true);
        if (frame === currentFrameRef.current) {
          scheduleDraw(frame);
        }
      };

      img.onerror = () => {
        pendingLoads.delete(frame);
        onSettled?.(false);
      };
    };

    const MOBILE_BUFFER_FORWARD = 50;
    const MOBILE_BUFFER_BACKWARD = 20;

    const manageCache = (currentFrame: number) => {
      const startWindow = Math.max(1, currentFrame - MOBILE_BUFFER_BACKWARD);
      const endWindow = Math.min(MOBILE_TOTAL_FRAMES, currentFrame + MOBILE_BUFFER_FORWARD);

      for (
        let frame = snapFrameToStride(startWindow, frameStride, MOBILE_TOTAL_FRAMES);
        frame <= endWindow;
        frame += frameStride
      ) {
        loadFrame(frame);
      }

      if (imageCache.size > 120) {
        for (const frame of imageCache.keys()) {
          if (frame < startWindow - 20 || frame > endWindow + 20) {
            imageCache.delete(frame);
          }
        }
      }
    };

    let lastCacheTriggerFrame = 1;
    const triggerCacheIfNeeded = (frame: number) => {
      if (Math.abs(frame - lastCacheTriggerFrame) >= 5) {
        lastCacheTriggerFrame = frame;
        manageCache(frame);
      }
    };

    // ── Плавний фоновий префетч для мобайлу ─
    const prefetchFramesInBackground = async () => {
      if (prefetchStartedRef.current) return;

      const connection = (navigator as Navigator & {
        connection?: { saveData?: boolean };
      }).connection;
      if (connection?.saveData) return;

      prefetchStartedRef.current = true;
      const controller = new AbortController();
      prefetchAbortRef.current = controller;

      const priorityClusters = [
        { center: 1, radius: 25 },
        { center: Math.round(MOBILE_TOTAL_FRAMES * 0.25), radius: 20 },
        { center: Math.round(MOBILE_TOTAL_FRAMES * 0.72), radius: 20 },
        { center: Math.round(MOBILE_TOTAL_FRAMES * 0.98), radius: 20 },
        { center: MOBILE_TOTAL_FRAMES, radius: 15 },
      ];

      const queuedFrames: number[] = [];
      const added = new Set<number>();

      for (const cluster of priorityClusters) {
        const minF = Math.max(1, cluster.center - cluster.radius);
        const maxF = Math.min(MOBILE_TOTAL_FRAMES, cluster.center + cluster.radius);
        for (
          let f = snapFrameToStride(minF, frameStride, MOBILE_TOTAL_FRAMES);
          f <= maxF;
          f += frameStride
        ) {
          if (!added.has(f)) {
            added.add(f);
            queuedFrames.push(f);
          }
        }
      }

      for (let f = 1; f <= MOBILE_TOTAL_FRAMES; f += frameStride) {
        if (!added.has(f)) {
          added.add(f);
          queuedFrames.push(f);
        }
      }

      const CONCURRENCY = 2;
      let queueIndex = 0;

      const worker = async () => {
        while (queueIndex < queuedFrames.length) {
          if (controller.signal.aborted) break;
          const frame = queuedFrames[queueIndex++];
          if (!frame || prefetchedFrames.has(frame)) continue;

          await new Promise<void>((resolve) => {
            const img = new Image();
            img.decoding = "async";
            img.onload = img.onerror = () => {
              prefetchedFrames.add(frame);
              updateBufferProgress();
              resolve();
            };
            img.src = getMobileFrameUrl(frame);
          });
        }
      };

      const workers = Array.from({ length: CONCURRENCY }, () => worker());
      await Promise.allSettled(workers);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Neon refs (перевіряються окремо всередині контексту — основні анімації працюють навіть без них)
    const neonContainer = neonContainerRef.current;
    const neonPanel = neonPanelRef.current;
    const neonOverlay = neonOverlayRef.current;
    const curtain = curtainRef.current;

    const initMobileFrameScroll = () => {
      frameTweenRef.current?.kill();

      const frameState = { frame: 1 };
      let lastRenderedFrame = 1;

      const renderFrameIfChanged = (nextFrame: number) => {
        const boundedFrame = snapFrameToStride(nextFrame, frameStride, MOBILE_TOTAL_FRAMES);
        if (boundedFrame === lastRenderedFrame) return;

        currentFrameRef.current = boundedFrame;
        triggerCacheIfNeeded(boundedFrame);
        scheduleDraw(boundedFrame);
        lastRenderedFrame = boundedFrame;
      };

      manageCache(1);
      drawFrame(1);

      frameTweenRef.current = gsap.to(frameState, {
        frame: MOBILE_TOTAL_FRAMES,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.35,
          onUpdate: (self) => {
            if (bar) {
              bar.style.transform = `scaleX(${self.progress * MAIN_PROGRESS_FRAC})`;
            }

            // При scrub інерції tween інколи не доходить до точного кадру 1/last на краях.
            if (self.progress <= 0.001) {
              renderFrameIfChanged(1);
              return;
            }

            if (self.progress >= 0.999) {
              renderFrameIfChanged(MOBILE_TOTAL_FRAMES);
              return;
            }

            renderFrameIfChanged(Math.round(frameState.frame));
          },
        },
      });
    };

    const criticalFramesList: number[] = [];
    for (let f = 1; f <= MOBILE_PRELOAD_CRITICAL_FRAMES; f += frameStride) {
      criticalFramesList.push(f);
    }
    const criticalTotal = criticalFramesList.length;
    const criticalReady = Math.min(
      criticalTotal,
      Math.ceil(MOBILE_PRELOAD_READY_THRESHOLD / frameStride),
    );

    let settledCritical = 0;
    let loadedCritical = 0;
    let mainScrollInitialized = false;

    const finalizeCriticalPreload = (ok: boolean, frame: number) => {
      settledCritical += 1;
      if (ok) loadedCritical += 1;

      setLoaderProgress(
        Math.min(100, Math.round((settledCritical / criticalTotal) * 100)),
      );
      setLoaderHint(
        `Loaded ${Math.min(loadedCritical, criticalTotal)} of ${criticalTotal}`,
      );

      if (frame === 1 && ok) {
        currentFrameRef.current = 1;
        drawFrame(1);
      }

      if (
        !mainScrollInitialized &&
        (loadedCritical >= criticalReady || settledCritical >= criticalTotal)
      ) {
        mainScrollInitialized = true;
        setLoaderTitle("Loading Mobile Frames");
        setLoaderHint("Ready");
        setIsMainReady(true);
        initMobileFrameScroll();
        window.setTimeout(() => {
          void prefetchFramesInBackground();
        }, 800);
      }
    };

    for (const frame of criticalFramesList) {
      loadFrame(frame, (ok) => finalizeCriticalPreload(ok, frame));
    }

    const ctx = gsap.context(() => {
      // ── 0. Hero parallax ────────────────────────────────────────────────
      // ╔══════════════════════════════════════════════════════════════════╗
      // ║  MOBILE HERO PARALLAX                                           ║
      // ║  yPercent: -100 → піднімається вгору                           ║
      // ║  scrub: 0.8 → трохи м'якше ніж десктоп (0.6)                  ║
      // ║  Змінюй yPercent та scrub                                       ║
      // ╚══════════════════════════════════════════════════════════════════╝
      gsap.to(hero, {
        yPercent: -100, // ← напрямок: негативне = вгору
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.8, // ← м'якше ніж десктоп (0.6) для комфорту на тачскрін
        },
      });

      // ── Scroll Hint: зникає як тільки починаємо скрол, з'являється у верхній точці ──
      if (scrollHintRef.current) {
        const hintEl = scrollHintRef.current;
        gsap.set(hintEl, { opacity: 1, y: 0 });
        ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          onUpdate: (self) => {
            const atTop = self.scroll() < 30;
            gsap.to(hintEl, {
              opacity: atTop ? 1 : 0,
              y: atTop ? 0 : 15,
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
          },
        });
      }

      // ── 2. Panel 0: "About our Gallery" ─────────────────────────────
      // ╔══════════════════════════════════════════════════════════════════╗
      // ║  MOBILE PANEL 0 TIMINGS                                         ║
      // ║  y: 80 → панель виїжджає знизу вгору                           ║
      // ║  Змінюй y (відстань/напрямок), start/end (коли видима)         ║
      // ║  scrub: 1.0 → трохи повільніше ніж десктоп (0.8)              ║
      // ╚══════════════════════════════════════════════════════════════════╝
      const tl0 = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "15% top",  // ← коли з'являється
          end: "35% top",   // ← коли зникає
          scrub: 0.4,
          onEnter: () => { panel0.style.pointerEvents = "auto"; },
          onLeave: () => { panel0.style.pointerEvents = "none"; },
          onEnterBack: () => { panel0.style.pointerEvents = "auto"; },
          onLeaveBack: () => { panel0.style.pointerEvents = "none"; },
        },
      });
      tl0
        .fromTo(
          [panel0, panel0Overlay],
          { opacity: 0, y: 95 }, // ← знизу
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        )
        .to(
          [panel0, panel0Overlay],
          { opacity: 0, y: 95, duration: 0.35, ease: "power2.in" },
          0.65,
        );

      // ── 3. Panel 1: "Discover our Art" ──────────────────────────────
      // ╔══════════════════════════════════════════════════════════════════╗
      // ║  MOBILE PANEL 1 TIMINGS                                         ║
      // ║  Змінюй y (відстань), start/end (коли видима), scrub (інерція) ║
      // ╚══════════════════════════════════════════════════════════════════╝
      const tl1 = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "60% top", // ← коли з'являється
          end: "70% top",   // ← коли зникає
          scrub: 0.4,
          onEnter: () => { panel1.style.pointerEvents = "auto"; },
          onLeave: () => { panel1.style.pointerEvents = "none"; },
          onEnterBack: () => { panel1.style.pointerEvents = "auto"; },
          onLeaveBack: () => { panel1.style.pointerEvents = "none"; },
        },
      });
      tl1
        .fromTo(
          [panel1, panel1Overlay],
          { opacity: 0, y: 95 }, // ← знизу
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        )
        .to(
          [panel1, panel1Overlay],
          { opacity: 0, y: 95, duration: 0.35, ease: "power2.in" },
          0.65,
        );

      // ── 4. Panel 2: "Art shop" ───────────────────────────────────────
      // ╔══════════════════════════════════════════════════════════════════╗
      // ║  MOBILE PANEL 2 TIMINGS                                         ║
      // ║  На мобайлі теж знизу (y: 80), на відміну від десктопу (x: 80)║
      // ║  Змінюй y, start/end, scrub                                     ║
      // ╚══════════════════════════════════════════════════════════════════╝
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "80% top", // ← коли з'являється
          end: "100% top",   // ← коли зникає
          scrub: 0.4,
          onEnter: () => { panel2.style.pointerEvents = "auto"; },
          onLeave: () => { panel2.style.pointerEvents = "none"; },
          onEnterBack: () => { panel2.style.pointerEvents = "auto"; },
          onLeaveBack: () => { panel2.style.pointerEvents = "none"; },
        },
      });
      tl2
        .fromTo(
          [panel2, panel2Overlay],
          { opacity: 0, y: 95 }, // ← знизу
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
        )
        .to(
          [panel2, panel2Overlay],
          { opacity: 0, y: 95, duration: 0.35, ease: "power2.in" },
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
          scrub: 1.0,
          onUpdate: (self) => {
            if (bar) bar.style.transform = `scaleX(${MAIN_PROGRESS_FRAC + self.progress * NEON_PROGRESS_FRAC})`;
          },
        });

        // ── Curtain: виїжджає знизу вгору наприкінці основного відео ────────────────
        // ╔══════════════════════════════════════════════════════════════════════╗
        // ║  MOBILE CURTAIN TIMING                                           ║
        // ║  start: коли ширма починає підніматися (% основного container)   ║
        // ║  end:   коли ширма повністю закриває екран                    ║
        // ╚══════════════════════════════════════════════════════════════════════╝
        gsap.to(curtain, {
          y: "0%",
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "87% top", // ← ширма починає підиматися
            end: "100% top",  // ← ширма повністю закриває екран
            scrub: 1.0,
          },
        });

        // ── Neon відео: проявляється під ширмою ─────────────────────────
        // ╔══════════════════════════════════════════════════════════════════════╗
        // ║  MOBILE NEON VIDEO FADE                                           ║
        // ║  start/end відносно neonContainer (400vh блок)                ║
        // ╚══════════════════════════════════════════════════════════════════════╝
        gsap.fromTo(
          neonVideo,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: neonContainer,
              start: "0% top",
              end: "20% top",
              scrub: 1.0,
              onEnter: () => { void neonVideo.play(); }, // ← явний play на всіх браузерах
            },
          },
        );

        // ── NeonSection panel: виїжджає знизу (як всі мобайльні панелі) ───────────
        // ╔══════════════════════════════════════════════════════════════════════╗
        // ║  MOBILE NEON PANEL TIMINGS                                        ║
        // ║  start/end відносно neonContainer                               ║
        // ║  y: 80 = знизу (as all mobile panels)                           ║
        // ╚══════════════════════════════════════════════════════════════════════╝
        const tlNeon = gsap.timeline({
          scrollTrigger: {
            trigger: neonContainer,
            start: "20% top",
            end: "85% top",
            scrub: 1.0,
            onEnter: () => { neonPanel.style.pointerEvents = "auto"; },
            onLeave: () => { neonPanel.style.pointerEvents = "none"; },
            onEnterBack: () => { neonPanel.style.pointerEvents = "auto"; },
            onLeaveBack: () => { neonPanel.style.pointerEvents = "none"; },
          },
        });
        tlNeon
          .fromTo(
            [neonPanel, neonOverlay],
            { opacity: 0, y: 95 }, // ← знизу
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
          )
          .to(
            [neonPanel, neonOverlay],
            { opacity: 0, y: 95, duration: 0.3, ease: "power2.in" },
            0.7,
          );
      }
    }, containerRef);

    // ══════════════════════════════════════════════════════════════════════
    // INTENT-DRIVEN SECTION GLIDER (Direct Touch & Wheel Interceptors)
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
          targetIndexRef.current = MOBILE_SNAP_POINTS.length;
          return;
        }
      }

      if (mainMaxScroll <= 0) return;
      const rawProgress = window.scrollY / mainMaxScroll;
      const clamped = Math.max(0, Math.min(1, rawProgress));

      let closest = 0;
      let minDiff = Infinity;
      for (let i = 0; i < MOBILE_SNAP_POINTS.length; i++) {
        const point = MOBILE_SNAP_POINTS[i] ?? 0;
        const diff = Math.abs(point - clamped);
        if (diff < minDiff) {
          minDiff = diff;
          closest = i;
        }
      }
      targetIndexRef.current = closest;
    };

    window.addEventListener("scroll", updateTargetFromScroll, { passive: true });

    const goToSection = (index: number) => {
      const isNeon = index >= MOBILE_SNAP_POINTS.length;
      const clamped = isNeon
        ? MOBILE_SNAP_POINTS.length
        : Math.max(0, Math.min(MOBILE_SNAP_POINTS.length - 1, index));
      targetIndexRef.current = clamped;
      isGlidingRef.current = true;

      let targetY: number;
      const neonEl = neonContainerRef.current;

      if (isNeon && neonEl) {
        // getBoundingClientRect дає правильну позицію навіть у React-фрагментах
        const neonRect = neonEl.getBoundingClientRect();
        const neonAbsTop = neonRect.top + window.scrollY;
        const neonMaxScroll = neonEl.offsetHeight - window.innerHeight;
        const neonOffset = neonAbsTop + Math.max(0, neonMaxScroll) * MOBILE_NEON_SNAP;
        targetY = neonOffset;
      } else {
        const progress = MOBILE_SNAP_POINTS[clamped] ?? 0;
        const maxScroll = container.offsetHeight - window.innerHeight;
        targetY = progress * maxScroll;
      }

      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(targetY, {
          duration: MOBILE_SNAP_DURATION,
          force: true,
          lock: true,
          easing: (t: number) => 1 - Math.pow(1 - t, 3),
          onComplete: () => {
            isGlidingRef.current = false;
          },
        });
      } else {
        window.scrollTo({ top: targetY, behavior: "smooth" });
        setTimeout(() => {
          isGlidingRef.current = false;
        }, MOBILE_SNAP_DURATION * 1000);
      }
    };

    const TOTAL_SECTIONS = MOBILE_SNAP_POINTS.length + 1; // +1 для Neon

    const handleHeroWheel = (e: WheelEvent) => {
      const neonEl = neonContainerRef.current;
      const mainMaxScroll = container.offsetHeight - window.innerHeight;
      const neonRect = neonEl?.getBoundingClientRect();
      const neonAbsTop = neonRect ? neonRect.top + window.scrollY : mainMaxScroll;
      const neonMaxScroll = neonEl ? Math.max(0, neonEl.offsetHeight - window.innerHeight) : 0;
      const neonTargetY = neonAbsTop + neonMaxScroll * MOBILE_NEON_SNAP;
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

      if (isGlidingRef.current) {
        e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaY) < 8) return;

      if (e.deltaY > 0 && targetIndexRef.current < TOTAL_SECTIONS - 1) {
        e.preventDefault();
        goToSection(targetIndexRef.current + 1);
        return;
      }
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
      const neonTargetY = neonAbsTop + neonMaxScroll * MOBILE_NEON_SNAP;
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

      for (const item of imageCache.values()) {
        if ("close" in item && typeof item.close === "function") {
          item.close();
        } else if ("src" in item) {
          item.src = "";
        }
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
      <div ref={scrollHintRef} className={styles.scrollHint}>
        <span>{t("hero.scroll")}</span>
        <div className={styles.scrollLine} />
      </div>
      {/* Прогрес-бар: чорний трек + сірий буфер завантаження + жовтий маркер */}
      <div className={styles.progressTrack}>
        <div ref={bufferBarRef} className={styles.bufferBar} />
        <div ref={progressBarRef} className={styles.progressBar} />
      </div>
    </div>

    <div ref={containerRef} className={styles.container}>
      <div className={styles.sticky}>
        {!isMainReady && (
          <div className={styles.heroLoader}>
            <p className={styles.heroLoaderTitle}>{loaderTitle}</p>
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

        <canvas
          ref={canvasRef}
          className={styles.video}
          data-video="mainMobile"
        />

        {/* Hero: логотип та назва галереї */}
        <div className={styles.aboutWrap}>
          <LogoSection ref={heroRef} />
        </div>


        {/* Panel 0 — "About our gallery" (зліва) */}
        <div ref={panel0OverlayRef} className={styles.panelOverlayMobile} />
        <div ref={panel0Ref} className={styles.panel}>
          <AboutGallerySection />
        </div>

        {/* Panel 1 — "Discover our art" (зліва) */}
        <div ref={panel1OverlayRef} className={styles.panelOverlayMobile} />
        <div ref={panel1Ref} className={styles.panel}>
          <ArtSection />
        </div>

        {/* Panel 2 — "Art shop" (справа, як на десктопі) */}
        <div ref={panel2OverlayRef} className={styles.panelOverlayMobile} />
        <div ref={panel2Ref} className={`${styles.panel} ${styles.panelRight}`}>
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
        {/* Neon відео — looping atmosphere */}
        {/* ↓↓ Змінюй src для іншого neon відео */}
        <video
          ref={neonVideoRef}
          className={styles.video}
          src={MOBILE_NEON_VIDEO_URL}
          muted
          loop
          autoPlay
          playsInline
          preload="auto"
        />

        {/* Neon панель — з'являється після відкриття ширми */}
        <div ref={neonOverlayRef} className={styles.panelOverlayMobile} />
        <div ref={neonPanelRef} className={styles.panel}>
          <NeonSection />
        </div>
      </div>
    </div>
    </>
  );
}
