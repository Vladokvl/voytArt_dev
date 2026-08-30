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

// ── Blur-up slide media ─────────────────────────────────────────────────────
// Shows a blurred card-preset placeholder (already in browser cache from the grid)
// while the full large-preset image loads, then fades to sharp.
function PaintingSlideMedia({
  item,
  isActive,
  paintingTitle,
  isPriority,
  placeholderUrl,
}: {
  item: MediaItem;
  isActive: boolean;
  paintingTitle: string;
  isPriority: boolean;
  placeholderUrl?: string; // smaller url already in browser cache (card preset)
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fullUrl = getOptimizedImageUrl(item.url, { preset: "large" });

  useEffect(() => {
    if (!videoRef.current) return;
    if (!isActive) {
      videoRef.current.pause();
    }
  }, [isActive]);

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
    <div className={styles.slideMedia}>
      {/* Blurred placeholder — unmounted after full image loads to free mobile GPU memory */}
      {!isLoaded && placeholderUrl && (
        <Image
          src={placeholderUrl}
          alt=""
          fill
          aria-hidden
          className={styles.mediaPlaceholder}
          sizes="(max-width: 768px) 100vw, 66vw"
          priority
          draggable={false}
        />
      )}

      {/* Spinner — visible until full image loads */}
      {!isLoaded && (
        <span className={styles.loadingSpinner} aria-hidden />
      )}

      {/* Full resolution image */}
      <Image
        src={fullUrl}
        alt={paintingTitle}
        fill
        className={`${styles.mediaEl} ${isLoaded ? styles.mediaElLoaded : ""}`}
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

  // Reset to slide 0 when neon mode switches or modal opens
  useEffect(() => {
    setSlideIndex(0);
    swiperRef.current?.slideTo(0, 0);
  }, [isNeon, open]);

  // Reset inquiry form when modal closes
  useEffect(() => {
    if (!open) {
      setIsNeon(false);
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
            speed={280}
            resistanceRatio={0.7}
            threshold={4}
            touchAngle={45}
            watchSlidesProgress={true}
            loop={false}
            allowTouchMove={hasMultiple && activeItems[slideIndex]?.type !== "VIDEO"}
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
                  isPriority={idx === 0}
                  // First slide: pass card-preset URL as placeholder (already cached from grid)
                  placeholderUrl={
                    idx === 0
                      ? getOptimizedImageUrl(item.url, { preset: "card" })
                      : undefined
                  }
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Arrow navigation */}
          {hasMultiple && (
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
          {hasMultiple && (
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
