"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LogoSection from "../Sections/LogoSection";
import AboutGallerySection from "../Sections/AboutGallerySection";
import ArtSection from "../Sections/ArtSection";
import ArtShopSection from "../Sections/ArtShopSection";
import NeonSection from "../Sections/NeonSection";
import styles from "./Hero.module.scss";

gsap.registerPlugin(ScrollTrigger);

// HeroMobile — мобільна/планшет версія з frame-scrub hero.
const MOBILE_TOTAL_FRAMES = 466;
const MOBILE_PRELOAD_CRITICAL_FRAMES = 14;
const MOBILE_PRELOAD_READY_THRESHOLD = 8;
const MOBILE_BUFFER_FORWARD = 70;
const MOBILE_BUFFER_BACKWARD = 15;
const HERO_READY_EVENT = "voyt:hero-ready";

const getMobileFrameSrc = (index: number) =>
  `/mainPageVideos/originals/mobile_frames/frame_${String(index).padStart(4, "0")}.webp`;

export default function HeroMobile() {
  const [isMainReady, setIsMainReady] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [loaderTitle, setLoaderTitle] = useState("Loading Mobile Frames");
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

  useEffect(() => {
    if (!isMainReady) return;

    const heroWindow = window as Window & { __voytHeroReady?: boolean };
    heroWindow.__voytHeroReady = true;
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

    const loadFrame = (frame: number, onSettled?: (ok: boolean) => void) => {
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
      img.onload = () => {
        pendingLoads.delete(frame);
        imageCache.set(frame, img);
        onSettled?.(true);

        if (frame === currentFrameRef.current) {
          drawFrame(frame);
        }
      };
      img.onerror = () => {
        pendingLoads.delete(frame);
        onSettled?.(false);
      };
      img.src = getMobileFrameSrc(frame);
    };

    const manageCache = (currentFrame: number) => {
      const startWindow = Math.max(1, currentFrame - MOBILE_BUFFER_BACKWARD);
      const endWindow = Math.min(MOBILE_TOTAL_FRAMES, currentFrame + MOBILE_BUFFER_FORWARD);

      for (let frame = startWindow; frame <= endWindow; frame += 1) {
        loadFrame(frame);
      }

      for (const frame of imageCache.keys()) {
        if (frame < startWindow || frame > endWindow) {
          const img = imageCache.get(frame);
          if (img) img.src = "";
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

      for (let frame = startFromFrame; frame <= MOBILE_TOTAL_FRAMES; frame += 1) {
        if (controller.signal.aborted) break;
        if (prefetchedFrames.has(frame)) continue;

        try {
          const response = await fetch(getMobileFrameSrc(frame), {
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
    const MAIN_PROGRESS_FRAC = 800 / 1200;
    const NEON_PROGRESS_FRAC = 400 / 1200;

    const initMobileFrameScroll = () => {
      frameTweenRef.current?.kill();

      const frameState = { frame: 1 };
      let lastRenderedFrame = 1;

      const renderFrameIfChanged = (nextFrame: number) => {
        const boundedFrame = Math.min(MOBILE_TOTAL_FRAMES, Math.max(1, nextFrame));
        if (boundedFrame === lastRenderedFrame) return;

        currentFrameRef.current = boundedFrame;
        manageCache(boundedFrame);
        drawFrame(boundedFrame);
        lastRenderedFrame = boundedFrame;
      };

      manageCache(1);
      drawFrame(1);

      frameTweenRef.current = gsap.to(frameState, {
        frame: MOBILE_TOTAL_FRAMES,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
          onUpdate: (self) => {
            if (bar) {
              bar.style.width = `${self.progress * MAIN_PROGRESS_FRAC * 100}%`;
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

    let settledCritical = 0;
    let loadedCritical = 0;
    let mainScrollInitialized = false;

    const finalizeCriticalPreload = (ok: boolean, frame: number) => {
      settledCritical += 1;
      if (ok) loadedCritical += 1;

      setLoaderProgress(
        Math.min(100, Math.round((settledCritical / MOBILE_PRELOAD_CRITICAL_FRAMES) * 100)),
      );
      setLoaderHint(
        `Loaded ${Math.min(loadedCritical, MOBILE_PRELOAD_CRITICAL_FRAMES)} of ${MOBILE_PRELOAD_CRITICAL_FRAMES}`,
      );

      if (frame === 1 && ok) {
        currentFrameRef.current = 1;
        drawFrame(1);
      }

      if (
        !mainScrollInitialized &&
        (loadedCritical >= MOBILE_PRELOAD_READY_THRESHOLD ||
          settledCritical >= MOBILE_PRELOAD_CRITICAL_FRAMES)
      ) {
        mainScrollInitialized = true;
        setLoaderTitle("Loading Mobile Frames");
        setLoaderHint("Ready");
        setIsMainReady(true);
        initMobileFrameScroll();
        window.setTimeout(() => {
          void prefetchFramesInBackground(MOBILE_PRELOAD_CRITICAL_FRAMES + 1);
        }, 1000);
      }
    };

    for (let frame = 1; frame <= MOBILE_PRELOAD_CRITICAL_FRAMES; frame += 1) {
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
          scrub: 1.0,
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
          start: "50% top", // ← коли з'являється
          end: "70% top",   // ← коли зникає
          scrub: 1.0,
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
          scrub: 1.0,
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
            if (bar) bar.style.width = `${(MAIN_PROGRESS_FRAC + self.progress * NEON_PROGRESS_FRAC) * 100}%`;
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

    return () => {
      window.removeEventListener("resize", resizeCanvas);

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
          src="/mainPageVideos/final_neon_mobile.mp4"
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
