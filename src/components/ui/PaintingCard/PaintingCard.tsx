"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./paintingCard.module.scss";
import { useState, useEffect, useTransition, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";
import { useSearchParams } from "next/navigation";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import { createPaintingInquiryAction } from "~/app/(site)/[locale]/art/_inquiryActions";
import { useTranslation } from "~/context/LanguageContext";
import { useLenis } from "~/context/LenisContext";
import { getLocalized } from "~/lib/i18n";
import { sanitizeHtml } from "~/lib/sanitize-html";
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
} from "lucide-react";

type MediaItem = {
  id: number;
  url: string;
  isNeon: boolean;
  order: number;
  type: "IMAGE" | "VIDEO";
};

type PaintingCardProps = {
  id: number;
  authorId?: number;
  title: string;
  titleUk?: string | null;
  description: string | null;
  descriptionUk?: string | null;
  coverUrl: string;
  year: number | null;
  author: {
    id?: number;
    firstName: string;
    firstNameUk?: string | null;
    lastName: string;
    lastNameUk?: string | null;
  };
  media: MediaItem[];
};

export default function PaintingCard({ painting }: { painting: PaintingCardProps }) {
  const { t, locale, getLocalizedHref } = useTranslation();
  const searchParams = useSearchParams();
  const isGlobalNeon = searchParams.get("neon") === "true";

  const defaultMedia = painting.media.filter((m) => !m.isNeon);
  const neonMedia = painting.media.filter((m) => m.isNeon);
  const hasNeonMedia = neonMedia.length > 0;

  // Global neon cover override if global neon mode is enabled and painting has neon media
  const showNeonCover = isGlobalNeon && hasNeonMedia;
  const gridCoverUrl = showNeonCover && neonMedia[0] ? neonMedia[0].url : painting.coverUrl;

  // Cover is always first in default mode; deduplicate if it's already in media
  const coverItem: MediaItem = {
    id: -painting.id,
    url: painting.coverUrl,
    isNeon: false,
    order: -1,
    type: "IMAGE",
  };
  const defaultItems: MediaItem[] = [
    coverItem,
    ...defaultMedia.filter((m) => m.url !== painting.coverUrl),
  ];

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isNeon, setIsNeon] = useState(isGlobalNeon && hasNeonMedia);

  // Inquiry form states
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [preferredContact, setPreferredContact] = useState("TELEGRAM");
  const [message, setMessage] = useState("");
  const [inquiryResult, setInquiryResult] = useState<{ success: boolean; inquiryNumber?: string; error?: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const activeItems = isNeon ? neonMedia : defaultItems;
  const hasMultiple = activeItems.length > 1;

  // ── Embla Carousel setup for rock-solid mobile swipe & PC controls ───────────
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 25,
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // When active items change (e.g. toggling neon mode) or modal opens, reInit
  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
      emblaApi.scrollTo(0, true);
      setSelectedIndex(0);
    }
  }, [isNeon, open, emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsNeon(isGlobalNeon && hasNeonMedia);
  }, [isGlobalNeon, hasNeonMedia]);

  const initialOpenedRef = useRef(false);

  // Deep-linking: auto-open modal on initial page load if ?painting=id (safely after hydration)
  useEffect(() => {
    if (!mounted || initialOpenedRef.current) return;
    const urlPainting = searchParams.get("painting");
    if (urlPainting && Number(urlPainting) === painting.id) {
      initialOpenedRef.current = true;
      const timer = setTimeout(() => {
        setOpen(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [mounted, searchParams, painting.id]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const authorId = painting.authorId ?? painting.author?.id;
      if (next) {
        if (authorId && !params.has("artist")) {
          params.set("artist", String(authorId));
        }
        params.set("painting", String(painting.id));
      } else {
        params.delete("painting");
      }
      const qs = params.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
    }

    if (next) {
      // Send background analytics event for painting modal open
      const payload = JSON.stringify({
        path: `/art?painting=${painting.id}`,
        pageType: "PAINTING",
        targetId: painting.id,
      });
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
      } else {
        void fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {
          // ignore analytics beacon errors
        });
      }
    } else {
      setIsNeon(false);
      setIsInquiryOpen(false);
      setInquiryResult(null);
    }
  };

  const handleModeToggle = () => {
    setIsNeon((v) => !v);
  };

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
    if (typeof window !== "undefined") {
      const params = new URLSearchParams();
      const authorId = painting.authorId ?? painting.author?.id;
      if (authorId) {
        params.set("artist", String(authorId));
      }
      params.set("painting", String(painting.id));
      if (isNeon) {
        params.set("neon", "true");
      }
      const localizedPath = getLocalizedHref("/art");
      const url = `${window.location.origin}${localizedPath}?${params.toString()}`;
      void navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      });
    }
  };

  const authorName = painting.author
    ? `${getLocalized(painting.author, "firstName", locale)} ${getLocalized(painting.author, "lastName", locale)}`.trim()
    : "VoytArt Artist";
  const paintingTitle = getLocalized(painting, "title", locale);

  const telegramDirectUrl = `https://t.me/voytart?text=${encodeURIComponent(
    `Привіт! Мене цікавить картина "${paintingTitle}" (${authorName})`
  )}`;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <motion.div
          className={styles.card}
          data-no-neon={isGlobalNeon && !hasNeonMedia ? "true" : undefined}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Image
            src={getOptimizedImageUrl(gridCoverUrl, { preset: "card" })}
            alt={paintingTitle}
            width={1200}
            height={1200}
            className={styles.cardImage}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </motion.div>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content
          className={styles.modal}
          data-neon={isNeon ? "true" : undefined}
        >
          {/* ── High-Performance Embla Carousel Area ──────────── */}
          <div className={styles.imageWrap}>
            <div className={styles.embla} ref={emblaRef}>
              <div className={styles.emblaContainer}>
                {activeItems.map((item, idx) => (
                  <div className={styles.emblaSlide} key={`${item.id}-${item.url}-${idx}`}>
                    {item.type === "VIDEO" ? (
                      <video
                        className={styles.mediaEl}
                        controls
                        autoPlay
                        playsInline
                      >
                        <source src={item.url} />
                      </video>
                    ) : (
                      <Image
                        src={getOptimizedImageUrl(item.url, { preset: "large" })}
                        alt={paintingTitle}
                        fill
                        className={styles.mediaEl}
                        sizes="(max-width: 768px) 100vw, 66vw"
                        draggable={false}
                        priority={idx === 0}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop-only navigation arrows */}
            {hasMultiple && (
              <>
                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.navPrev}`}
                  onClick={scrollPrev}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.navNext}`}
                  onClick={scrollNext}
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
                <div className={styles.counter}>
                  {selectedIndex + 1} / {activeItems.length}
                </div>
              </>
            )}

            {/* Segmented Progress Indicator (tapping dashes smoothly scrolls to slide) */}
            {hasMultiple && (
              <div className={styles.progressDashes} role="tablist" aria-label="Slides progress">
                {activeItems.map((item, idx) => (
                  <button
                    key={`dash-${item.id}-${item.url}-${idx}`}
                    type="button"
                    role="tab"
                    className={`${styles.dashItem} ${idx === selectedIndex ? styles.dashItemActive : ""}`}
                    onClick={() => scrollTo(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    aria-selected={idx === selectedIndex}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Info & Inquiry panel (right column) ──────────── */}
          <div className={styles.info}>
            <AnimatePresence mode="wait">
              {!isInquiryOpen ? (
                /* ── Standard Painting Info View ── */
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
                      <span className={styles.authorLabel}>
                        {authorName}
                      </span>
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

                    {/* Specs Badges */}
                    <div className={styles.specsRow}>
                      {painting.year && (
                        <span className={styles.specBadge}>{painting.year}</span>
                      )}
                      <span className={styles.specBadge}>{t("art.originalArtwork")}</span>
                      {hasNeonMedia && (
                        <span className={styles.specBadgeNeon}>
                          <Sparkles size={12} />
                          <span>{t("art.uvNeonGlow")}</span>
                        </span>
                      )}
                    </div>

                    {/* Premium Neon Switcher Pill */}
                    {hasNeonMedia && (
                      <div className={styles.neonPillSwitch} onClick={handleModeToggle}>
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
                    <button
                      type="button"
                      onClick={() => setIsInquiryOpen(true)}
                      className={styles.btnPrimary}
                    >
                      <span>{t("art.interested")}</span>
                    </button>
                    <Dialog.Close className={styles.btnGhost}>{t("art.close")}</Dialog.Close>
                  </div>
                </motion.div>
              ) : (
                /* ── Inquiry Contact Form Sub-view ── */
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
                        onClick={() => {
                          setIsInquiryOpen(false);
                          setInquiryResult(null);
                        }}
                        className={styles.backBtn}
                      >
                        <ArrowLeft size={16} />
                        <span>{t("art.inquiryBack")}</span>
                      </button>
                      <span className={styles.inquiryTitle}>{t("art.inquiryTitle")}</span>
                    </div>

                    {/* Painting Mini Preview */}
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
                        <span className={styles.snippetAuthor}>
                          {authorName}
                        </span>
                      </div>
                    </div>

                    {inquiryResult?.success ? (
                      <div className={styles.inquirySuccessBox}>
                        <CheckCircle2 size={44} className={styles.successIcon} />
                        <h4 className={styles.successTitle}>{t("art.inquirySuccessTitle")}</h4>
                        <p className={styles.successText}>
                          {t("art.inquiryReference")}: <strong>{inquiryResult.inquiryNumber}</strong>
                        </p>
                        <p className={styles.successSub}>
                          {t("art.inquirySuccessDesc")}
                        </p>
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

                    {/* Direct Telegram Chat Option */}
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
    </Dialog.Root>
  );
}
