"use client";

import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./paintingCard.module.scss";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import { useTranslation } from "~/context/LanguageContext";
import { getLocalized } from "~/lib/i18n";
import PaintingModal, { type PaintingData } from "./PaintingModal";

export type { PaintingData };

type PaintingCardProps = {
  painting: PaintingData;
};

export default function PaintingCard({ painting }: PaintingCardProps) {
  const { locale } = useTranslation();
  const searchParams = useSearchParams();
  const isGlobalNeon = searchParams.get("neon") === "true";

  const hasNeonMedia = painting.media.some((m) => m.isNeon);
  const showNeonCover = isGlobalNeon && hasNeonMedia;
  const neonCoverUrl = painting.media.find((m) => m.isNeon)?.url;
  const gridCoverUrl = showNeonCover && neonCoverUrl ? neonCoverUrl : painting.coverUrl;

  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const initialOpenedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Deep-linking: auto-open modal on initial page load if ?painting=id
  useEffect(() => {
    if (!mounted || initialOpenedRef.current) return;
    const urlPainting = searchParams.get("painting");
    if (urlPainting && Number(urlPainting) === painting.id) {
      initialOpenedRef.current = true;
      const timer = setTimeout(() => setOpen(true), 50);
      return () => clearTimeout(timer);
    }
  }, [mounted, searchParams, painting.id]);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);

    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const authorId = painting.authorId ?? painting.author?.id;

    if (next) {
      if (authorId && !params.has("artist")) params.set("artist", String(authorId));
      params.set("painting", String(painting.id));

      // Analytics beacon
      const pathUrl = authorId
        ? `/art?artist=${authorId}&painting=${painting.id}`
        : `/art?painting=${painting.id}`;
      const payload = JSON.stringify({ path: pathUrl, pageType: "PAINTING", targetId: painting.id });
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
      } else {
        void fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => undefined);
      }
    } else {
      params.delete("painting");
    }

    const qs = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  };

  const paintingTitle = getLocalized(painting, "title", locale);

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

      <PaintingModal
        painting={painting}
        open={open}
        isGlobalNeon={isGlobalNeon}
      />
    </Dialog.Root>
  );
}
