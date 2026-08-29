"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./paintingCard.module.scss";
import { useState, useEffect, useTransition, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedSet, setLoadedSet] = useState<Set<string>>(new Set());

  // Inquiry form states
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [customerName, setCustomerName] = useState("");
  const [customerContact, setCustomerContact] = useState("");
  const [preferredContact, setPreferredContact] = useState("TELEGRAM");
  const [message, setMessage] = useState("");
  const [inquiryResult, setInquiryResult] = useState<{ success: boolean; inquiryNumber?: string; error?: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

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

  const activeItems = isNeon ? neonMedia : defaultItems;
  const hasMultiple = activeItems.length > 1;

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
      setActiveIndex(0);
      setLoadedSet(new Set());
      setIsInquiryOpen(false);
      setInquiryResult(null);
    }
  };

  const handleModeToggle = () => {
    setIsNeon((v) => !v);
    setActiveIndex(0);
    setLoadedSet(new Set());
  };

  const navigate = (dir: "prev" | "next") => {
    const len = activeItems.length;
    setActiveIndex((i) =>
      dir === "prev" ? (i === 0 ? len - 1 : i - 1) : (i === len - 1 ? 0 : i + 1)
    );
  };

  const markLoaded = (url: string) => {
    setLoadedSet((s) => new Set([...s, url]));
  };

  // Touch Swipe gestures for mobile
  const [touchStartPos, setTouchStartPos] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      setTouchStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartPos || !e.changedTouches[0]) return;
    const deltaX = e.changedTouches[0].clientX - touchStartPos.x;
    const deltaY = e.changedTouches[0].clientY - touchStartPos.y;
    setTouchStartPos(null);

    // Swipe horizontal check (min 40px threshold and dominant horizontal direction)
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        navigate("prev");
      } else {
        navigate("next");
      }
    }
  };

  const currentItem = activeItems[activeIndex];
  const isCurrentLoaded =
    currentItem?.type === "VIDEO"
      ? true
      : currentItem
      ? loadedSet.has(currentItem.url)
      : true;

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
          {/* ── Slider area ─────────────────────────────────── */}
          <div
            className={styles.imageWrap}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Spinner shown while active image loads */}
            {!isCurrentLoaded && <div className={styles.spinner} aria-hidden="true" />}

            {/* All slides pre-rendered; translateX reveals active slide */}
            <div
              className={styles.sliderTrack}
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {activeItems.map((item, idx) => (
                <div
                  className={styles.slide}
                  key={`${item.id}-${item.url}`}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
                    e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.setProperty("--mouse-x", "50%");
                    e.currentTarget.style.setProperty("--mouse-y", "50%");
                  }}
                >
                  {item.type === "VIDEO" ? (
                    <video
                      className={styles.mediaEl}
                      controls
                      autoPlay={idx === activeIndex}
                      playsInline
                    >
                      <source src={item.url} />
                    </video>
                  ) : (
                    <>
                      {/* Cached preview layer (reuse already loaded card cover without extra Cloudinary credits) */}
                      {!loadedSet.has(item.url) && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={gridCoverUrl}
                          alt=""
                          className={styles.mediaEl}
                          style={{
                            filter: "blur(6px)",
                            transform: "scale(1.02)",
                            position: "absolute",
                            inset: 0,
                            zIndex: 1,
                          }}
                          aria-hidden="true"
                        />
                      )}
                      <Image
                        src={getOptimizedImageUrl(item.url, { preset: "large" })}
                        alt={paintingTitle}
                        fill
                        className={styles.mediaEl}
                        style={{
                          opacity: loadedSet.has(item.url) ? 1 : 0,
                          transition: "opacity 0.25s ease",
                          zIndex: 2,
                        }}
                        sizes="(max-width: 768px) 100vw, 66vw"
                        onLoad={() => markLoaded(item.url)}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Navigation arrows */}
            {hasMultiple && (
              <>
                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.navPrev}`}
                  onClick={() => navigate("prev")}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className={`${styles.navBtn} ${styles.navNext}`}
                  onClick={() => navigate("next")}
                  aria-label="Next image"
                >
                  ›
                </button>
                <div className={styles.counter}>
                  {activeIndex + 1} / {activeItems.length}
                </div>
              </>
            )}

            {/* Thumbnails row below active image */}
            {hasMultiple && (
              <div className={styles.thumbnailsBar}>
                {activeItems.map((item, idx) => (
                  <button
                    key={`thumb-${item.id}-${item.url}`}
                    type="button"
                    className={`${styles.thumbBtn} ${idx === activeIndex ? styles.thumbBtnActive : ""}`}
                    onClick={() => setActiveIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                  >
                    <Image
                      src={getOptimizedImageUrl(item.url, { preset: "thumb" })}
                      alt=""
                      width={44}
                      height={44}
                      className={styles.thumbImg}
                    />
                  </button>
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
