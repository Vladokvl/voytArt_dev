"use client";

import styles from "./paintingCard.module.scss";
import { useTranslation } from "~/context/LanguageContext";
import { useLenis } from "~/context/LenisContext";
import { getLocalized } from "~/lib/i18n";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import { sanitizeHtml } from "~/lib/sanitize-html";
import { createPaintingInquiryAction } from "~/app/(site)/[locale]/art/_inquiryActions";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import { useState, useEffect, useTransition, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import {
  Send,
  MessageCircle,
  CheckCircle2,
  Share2,
  Sparkles,
  Sun,
  Moon,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export type MediaItem = {
  id: number;
  url: string;
  isNeon: boolean;
  order: number;
  type: "IMAGE" | "VIDEO";
};

export type PaintingData = {
  id: number;
  authorId?: number;
  title: string;
  titleUk?: string | null;
  description: string | null;
  descriptionUk?: string | null;
  coverUrl: string;
  year: number | null;
  isForSale?: boolean;
  author: {
    id?: number;
    firstName: string;
    firstNameUk?: string | null;
    lastName: string;
    lastNameUk?: string | null;
  };
  media: MediaItem[];
};

// ── Blur-up / Fast placeholder slide media ───────────────────────────────────
// Shows a lightweight card-preset placeholder while the full large-preset image loads,
// and immediately unmounts the placeholder once loaded.
function PaintingSlideMedia({
  item,
  isActive,
  paintingTitle,
  isPriority,
  placeholderUrl,
  isZoomMode = false,
}: {
  item: MediaItem;
  isActive: boolean;
  paintingTitle: string;
  isPriority: boolean;
  placeholderUrl?: string;
  isZoomMode?: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50, isHovering: false });
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const fullUrl = item.url;

  useEffect(() => {
    if (!videoRef.current) return;
    if (!isActive) {
      videoRef.current.pause();
    }
  }, [isActive]);

  // Check if image was already cached by browser
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [fullUrl]);

  // Reset zoom on slide transition
  useEffect(() => {
    if (!isActive || !isZoomMode) {
      setZoomPos({ x: 50, y: 50, isHovering: false });
    }
  }, [isActive, isZoomMode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomMode || item.type === "VIDEO") return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    // Запас від країв (12%), щоб не потрібно було доводити курсор впритул до межі модалки
    const PADDING = 0.12;
    const normX = (e.clientX - rect.left) / rect.width;
    const normY = (e.clientY - rect.top) / rect.height;

    const mappedX = (normX - PADDING) / (1 - 2 * PADDING);
    const mappedY = (normY - PADDING) / (1 - 2 * PADDING);

    const x = Math.max(0, Math.min(100, mappedX * 100));
    const y = Math.max(0, Math.min(100, mappedY * 100));

    setZoomPos({ x, y, isHovering: true });
  };

  const handleMouseEnter = () => {
    if (isZoomMode && item.type !== "VIDEO") {
      setZoomPos((prev) => ({ ...prev, isHovering: true }));
    }
  };

  const handleMouseLeave = () => {
    if (isZoomMode) {
      setZoomPos((prev) => ({ ...prev, isHovering: false }));
    }
  };

  if (item.type === "VIDEO") {
    return (
      <div className={styles.slideMedia}>
        <video
          ref={videoRef}
          className={styles.mediaElVideo}
          controls
          playsInline
          preload="metadata"
        >
          <source src={item.url} />
        </video>
      </div>
    );
  }

  return (
    <div
      className={`${styles.slideMedia} ${isZoomMode ? styles.slideMediaZoom : ""}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Placeholder — unmounted after full image loads to free mobile GPU memory */}
      {!isLoaded && placeholderUrl && (
        <Image
          src={placeholderUrl}
          alt=""
          fill
          aria-hidden
          className={styles.mediaPlaceholder}
          sizes="(max-width: 768px) 100vw, 66vw"
          priority={isPriority}
          draggable={false}
        />
      )}

      {/* Spinner — visible until full image loads */}
      {!isLoaded && (
        <span className={styles.loadingSpinner} aria-hidden />
      )}

      {/* Full resolution original image */}
      <Image
        ref={imgRef}
        src={fullUrl}
        alt={paintingTitle}
        fill
        unoptimized
        className={`${styles.mediaEl} ${isLoaded ? styles.mediaElLoaded : ""}`}
        style={
          isZoomMode && zoomPos.isHovering
            ? {
                transform: "scale(2.3)",
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transition: "transform 0.12s ease-out",
                willChange: "transform, transform-origin",
              }
            : isZoomMode
            ? {
                transform: "scale(1)",
                transformOrigin: "center",
                transition: "transform 0.25s ease-out",
              }
            : undefined
        }
        sizes="(max-width: 768px) 100vw, 66vw"
        priority={isPriority}
        loading={isPriority ? "eager" : "lazy"}
        draggable={false}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

type PaintingModalProps = {
  painting: PaintingData;
  open: boolean;
  isGlobalNeon: boolean;
};

export default function PaintingModal({
  painting,
  open,
  isGlobalNeon,
}: PaintingModalProps) {
  const { t, locale, getLocalizedHref } = useTranslation();

  const defaultItems = useMemo<MediaItem[]>(() => {
    const defaultMedia = painting.media.filter((m) => !m.isNeon);
    const coverItem: MediaItem = {
      id: -painting.id,
      url: painting.coverUrl,
      isNeon: false,
      order: -1,
      type: "IMAGE",
    };
    return [coverItem, ...defaultMedia.filter((m) => m.url !== painting.coverUrl)];
  }, [painting.id, painting.coverUrl, painting.media]);

  const neonMedia = useMemo<MediaItem[]>(
    () => painting.media.filter((m) => m.isNeon),
    [painting.media]
  );

  const hasNeonMedia = neonMedia.length > 0;

  const [isNeon, setIsNeon] = useState(isGlobalNeon && hasNeonMedia);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isZoomMode, setIsZoomMode] = useState(false);
  const swiperRef = useRef<SwiperType | null>(null);

  // Inquiry form state
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [preferredContact, setPreferredContact] = useState("TELEGRAM");
  const [message, setMessage] = useState("");
  const [inquiryResult, setInquiryResult] = useState<{
    success: boolean;
    inquiryNumber?: string;
    error?: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const activeItems = isNeon ? neonMedia : defaultItems;
  const hasMultiple = activeItems.length > 1;

  // Sync isNeon with global neon mode
  useEffect(() => {
    setIsNeon(isGlobalNeon && hasNeonMedia);
  }, [isGlobalNeon, hasNeonMedia]);

  // Reset to slide 0 and disable zoom when neon mode switches or modal opens
  useEffect(() => {
    setSlideIndex(0);
    setIsZoomMode(false);
    swiperRef.current?.slideTo(0, 0);
  }, [isNeon, open]);

  // Reset zoom on slide change
  useEffect(() => {
    setIsZoomMode(false);
  }, [slideIndex]);

  // Reset inquiry form when modal closes
  useEffect(() => {
    if (!open) {
      setIsNeon(false);
      setIsZoomMode(false);
      setIsInquiryOpen(false);
      setInquiryResult(null);
    }
  }, [open]);

  // Block Lenis scroll when modal is open
  const { start: startLenis, stop: stopLenis } = useLenis();
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      stopLenis();
    } else {
      document.body.style.overflow = "";
      startLenis();
    }
    return () => {
      document.body.style.overflow = "";
      startLenis();
    };
  }, [open, startLenis, stopLenis]);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setSlideIndex(swiper.activeIndex);
  }, []);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerContact.trim()) return;
    startTransition(async () => {
      const res = await createPaintingInquiryAction({
        paintingId: painting.id,
        customerName,
        customerContact,
        preferredContact,
        message,
      });
      setInquiryResult(res);
    });
  };

  const handleCopyLink = () => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();
    const authorId = painting.authorId ?? painting.author?.id;
    if (authorId) params.set("artist", String(authorId));
    params.set("painting", String(painting.id));
    if (isNeon) params.set("neon", "true");
    const url = `${window.location.origin}${getLocalizedHref("/art")}?${params.toString()}`;
    void navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    });
  };

  const authorName = painting.author
    ? `${getLocalized(painting.author, "firstName", locale)} ${getLocalized(painting.author, "lastName", locale)}`.trim()
    : "VoytArt Artist";
  const paintingTitle = getLocalized(painting, "title", locale);
  const telegramDirectUrl = `https://t.me/voytart?text=${encodeURIComponent(
    `Привіт! Мене цікавить картина "${paintingTitle}" (${authorName})`
  )}`;

  return (
    <Dialog.Portal>
      <Dialog.Overlay className={styles.overlay} />
      <Dialog.Content
        className={styles.modal}
        data-neon={isNeon ? "true" : undefined}
      >
        {/* Floating circular close button (mirrors gallery post back button style) */}
        <Dialog.Close asChild>
          <button
            type="button"
            className={styles.floatingCloseBtn}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </Dialog.Close>

        {/* ── Swiper Carousel ─────────────────────────────────── */}
        <div className={styles.imageWrap}>
          <Swiper
            modules={[Navigation, Pagination, A11y]}
            spaceBetween={0}
            slidesPerView={1}
            speed={300}
            resistanceRatio={0.7}
            threshold={5}
            touchAngle={45}
            watchSlidesProgress={false}
            roundLengths={true}
            autoHeight={false}
            nested={true}
            touchReleaseOnEdges={true}
            loop={false}
            allowTouchMove={hasMultiple && !isZoomMode && activeItems[slideIndex]?.type !== "VIDEO"}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            onSlideChange={handleSlideChange}
            className={styles.swiperInstance}
          >
            {activeItems.map((item, idx) => (
              <SwiperSlide key={`${item.id}-${item.url}-${idx}`} className={styles.swiperSlide}>
                <PaintingSlideMedia
                  item={item}
                  isActive={idx === slideIndex}
                  paintingTitle={paintingTitle}
                  isPriority={idx < 2}
                  placeholderUrl={getOptimizedImageUrl(item.url, { preset: "card" })}
                  isZoomMode={isZoomMode}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Floating circular Zoom / Loupe button (Desktop only, opposite to close button) */}
          {activeItems[slideIndex]?.type !== "VIDEO" && (
            <button
              type="button"
              className={`${styles.floatingZoomBtn} ${isZoomMode ? styles.zoomBtnActive : ""}`}
              onClick={() => setIsZoomMode((prev) => !prev)}
              aria-label={isZoomMode ? "Disable zoom mode" : "Enable zoom mode"}
              aria-pressed={isZoomMode}
              title={
                isZoomMode
                  ? locale === "uk"
                    ? "Вимкнути лупу"
                    : "Disable loupe"
                  : locale === "uk"
                  ? "Увімкнути режим лупи"
                  : "Enable loupe mode"
              }
            >
              {isZoomMode ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
            </button>
          )}

          {/* Arrow navigation */}
          {hasMultiple && !isZoomMode && (
            <>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.navPrev}`}
                onClick={() => swiperRef.current?.slidePrev()}
                aria-label="Previous image"
                disabled={slideIndex === 0}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.navNext}`}
                onClick={() => swiperRef.current?.slideNext()}
                aria-label="Next image"
                disabled={slideIndex === activeItems.length - 1}
              >
                <ChevronRight size={20} />
              </button>
              <div className={styles.counter}>
                {slideIndex + 1} / {activeItems.length}
              </div>
            </>
          )}

          {/* Progress dots */}
          {hasMultiple && !isZoomMode && (
            <div className={styles.progressDashes} role="tablist" aria-label="Slides progress">
              {activeItems.map((item, idx) => (
                <button
                  key={`dash-${item.id}-${idx}`}
                  type="button"
                  role="tab"
                  className={`${styles.dashItem} ${idx === slideIndex ? styles.dashItemActive : ""}`}
                  onClick={() => swiperRef.current?.slideTo(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-selected={idx === slideIndex}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Info & Inquiry panel ─────────────────────────────── */}
        <div className={styles.info}>
          <AnimatePresence mode="wait">
            {!isInquiryOpen ? (
              <motion.div
                key="info-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className={styles.panelContent}
              >
                <div className={styles.scrollableContent} data-lenis-prevent>
                  <div className={styles.authorHeader}>
                    <span className={styles.authorLabel}>{authorName}</span>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className={styles.shareBtn}
                      title="Copy direct link"
                      aria-label="Copy link to painting"
                    >
                      <Share2 size={15} />
                      <span>{copiedLink ? t("art.copied") : t("art.share")}</span>
                    </button>
                  </div>

                  <Dialog.Title className={styles.title}>{paintingTitle}</Dialog.Title>

                  <div className={styles.specsRow}>
                    {painting.year && <span className={styles.specBadge}>{painting.year}</span>}
                    <span className={styles.specBadge}>{t("art.originalArtwork")}</span>
                    {hasNeonMedia && (
                      <span className={styles.specBadgeNeon}>
                        <Sparkles size={12} />
                        <span>{t("art.uvNeonGlow")}</span>
                      </span>
                    )}
                  </div>

                  {hasNeonMedia && (
                    <div className={styles.neonPillSwitch} onClick={() => setIsNeon((v) => !v)}>
                      <button
                        type="button"
                        className={`${styles.pillOption} ${!isNeon ? styles.pillOptionActive : ""}`}
                      >
                        <Sun size={14} />
                        <span>{t("art.daylight")}</span>
                      </button>
                      <button
                        type="button"
                        className={`${styles.pillOption} ${isNeon ? styles.pillOptionNeonActive : ""}`}
                      >
                        <Moon size={14} />
                        <span>{t("art.neonGlow")}</span>
                      </button>
                    </div>
                  )}

                  {painting.description && (
                    <div
                      className={styles.description}
                      data-lenis-prevent
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(getLocalized(painting, "description", locale)),
                      }}
                    />
                  )}
                </div>

                <div className={styles.actions}>
                  {painting.isForSale && (
                    <button
                      type="button"
                      onClick={() => setIsInquiryOpen(true)}
                      className={styles.btnPrimary}
                    >
                      <span>{t("art.interested")}</span>
                    </button>
                  )}
                  <Dialog.Close className={styles.btnGhost}>{t("art.close")}</Dialog.Close>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="inquiry-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className={styles.panelContent}
              >
                <div className={styles.scrollableContent} data-lenis-prevent>
                  <div className={styles.inquiryHeader}>
                    <button
                      type="button"
                      onClick={() => { setIsInquiryOpen(false); setInquiryResult(null); }}
                      className={styles.backBtn}
                    >
                      <ArrowLeft size={16} />
                      <span>{t("art.inquiryBack")}</span>
                    </button>
                    <span className={styles.inquiryTitle}>{t("art.inquiryTitle")}</span>
                  </div>

                  <div className={styles.inquiryPaintingSnippet}>
                    <div className={styles.snippetThumbWrap}>
                      <Image
                        src={getOptimizedImageUrl(painting.coverUrl, { preset: "thumb" })}
                        alt={paintingTitle}
                        fill
                        className={styles.snippetImg}
                      />
                    </div>
                    <div className={styles.snippetDetails}>
                      <span className={styles.snippetTitle}>{paintingTitle}</span>
                      <span className={styles.snippetAuthor}>{authorName}</span>
                    </div>
                  </div>

                  {inquiryResult?.success ? (
                    <div className={styles.inquirySuccessBox}>
                      <CheckCircle2 size={44} className={styles.successIcon} />
                      <h4 className={styles.successTitle}>{t("art.inquirySuccessTitle")}</h4>
                      <p className={styles.successText}>
                        {t("art.inquiryReference")}: <strong>{inquiryResult.inquiryNumber}</strong>
                      </p>
                      <p className={styles.successSub}>{t("art.inquirySuccessDesc")}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleInquirySubmit} className={styles.inquiryForm}>
                      {inquiryResult?.error && (
                        <div className={styles.inquiryError}>{inquiryResult.error}</div>
                      )}
                      <div className={styles.inquiryField}>
                        <label className={styles.fieldLabel}>{t("art.yourName")} *</label>
                        <input
                          type="text"
                          required
                          placeholder="Alex"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className={styles.inquiryInput}
                        />
                      </div>
                      <div className={styles.inquiryField}>
                        <label className={styles.fieldLabel}>{t("art.phoneTelegram")} *</label>
                        <input
                          type="text"
                          required
                          placeholder="+380... or @username"
                          value={customerContact}
                          onChange={(e) => setCustomerContact(e.target.value)}
                          className={styles.inquiryInput}
                        />
                      </div>
                      <div className={styles.inquiryField}>
                        <label className={styles.fieldLabel}>{t("art.preferredContact")}</label>
                        <div className={styles.preferredContactGroup}>
                          {["TELEGRAM", "PHONE", "WHATSAPP", "EMAIL"].map((method) => (
                            <button
                              key={method}
                              type="button"
                              className={`${styles.prefBtn} ${preferredContact === method ? styles.prefBtnActive : ""}`}
                              onClick={() => setPreferredContact(method)}
                            >
                              {method === "TELEGRAM" && "Telegram"}
                              {method === "PHONE" && "Phone"}
                              {method === "WHATSAPP" && "WhatsApp"}
                              {method === "EMAIL" && "Email"}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className={styles.inquiryField}>
                        <label className={styles.fieldLabel}>{t("art.messageOptional")}</label>
                        <textarea
                          placeholder="e.g. Inquiring about price, dimensions, or gallery viewing in Kyiv..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className={styles.inquiryTextarea}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isPending}
                        className={styles.inquirySubmitBtn}
                      >
                        <Send size={16} />
                        <span>{isPending ? t("art.sending") : t("art.submitInquiry")}</span>
                      </button>
                    </form>
                  )}

                  <div className={styles.directTelegramWrap}>
                    <span className={styles.orDivider}>{t("art.orContactDirectly")}</span>
                    <a
                      href={telegramDirectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.telegramDirectBtn}
                    >
                      <MessageCircle size={17} />
                      <span>{t("art.chatTelegram")}</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
