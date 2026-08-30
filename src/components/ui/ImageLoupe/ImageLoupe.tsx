"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import Image from "next/image";
import { ZoomIn, ZoomOut } from "lucide-react";
import styles from "./imageLoupe.module.scss";

export interface ImageLoupeProps {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  unoptimized?: boolean;
  className?: string;
  containerClassName?: string;
  sizes?: string;
  zoomScale?: number;
  edgePadding?: number;
  showButton?: boolean;
  isZoomMode?: boolean;
  onZoomToggle?: (active: boolean) => void;
  onLoad?: () => void;
  children?: ReactNode;
}

export default function ImageLoupe({
  src,
  alt,
  fill = true,
  priority = false,
  unoptimized = true,
  className = "",
  containerClassName = "",
  sizes = "(max-width: 768px) 100vw, 66vw",
  zoomScale = 2.3,
  edgePadding = 0.12,
  showButton = true,
  isZoomMode: controlledZoom,
  onZoomToggle,
  onLoad,
  children,
}: ImageLoupeProps) {
  const [internalZoom, setInternalZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50, isHovering: false });
  const containerRef = useRef<HTMLDivElement>(null);

  const isZoom = controlledZoom ?? internalZoom;

  const toggleZoom = () => {
    const next = !isZoom;
    if (controlledZoom === undefined) {
      setInternalZoom(next);
    }
    onZoomToggle?.(next);
  };

  // Reset hover state when src or zoom mode changes
  useEffect(() => {
    setZoomPos({ x: 50, y: 50, isHovering: false });
  }, [src, isZoom]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const normX = (e.clientX - rect.left) / rect.width;
    const normY = (e.clientY - rect.top) / rect.height;

    // Ремапінг з урахуванням запасу від країв
    const mappedX = (normX - edgePadding) / (1 - 2 * edgePadding);
    const mappedY = (normY - edgePadding) / (1 - 2 * edgePadding);

    const x = Math.max(0, Math.min(100, mappedX * 100));
    const y = Math.max(0, Math.min(100, mappedY * 100));

    setZoomPos({ x, y, isHovering: true });
  };

  const handleMouseEnter = () => {
    if (isZoom) {
      setZoomPos((prev) => ({ ...prev, isHovering: true }));
    }
  };

  const handleMouseLeave = () => {
    if (isZoom) {
      setZoomPos((prev) => ({ ...prev, isHovering: false }));
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.loupeContainer} ${isZoom ? styles.loupeActive : ""} ${containerClassName}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Optional nested components (e.g. placeholder, spinner) */}
      {children}

      {/* Main Image with hardware-accelerated zoom */}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        priority={priority}
        unoptimized={unoptimized}
        sizes={sizes}
        onLoad={onLoad}
        draggable={false}
        className={`${styles.loupeImage} ${className}`}
        style={
          isZoom && zoomPos.isHovering
            ? {
                transform: `scale(${zoomScale})`,
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transition: "transform 0.12s ease-out",
                willChange: "transform, transform-origin",
              }
            : isZoom
            ? {
                transform: "scale(1)",
                transformOrigin: "center",
                transition: "transform 0.25s ease-out",
              }
            : undefined
        }
      />

      {/* Floating Toggle Button (Desktop only) */}
      {showButton && (
        <button
          type="button"
          className={`${styles.floatingZoomBtn} ${isZoom ? styles.zoomBtnActive : ""}`}
          onClick={toggleZoom}
          aria-label={isZoom ? "Disable zoom mode" : "Enable zoom mode"}
          aria-pressed={isZoom}
          title={isZoom ? "Вимкнути лупу" : "Увімкнути режим лупи"}
        >
          {isZoom ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
        </button>
      )}
    </div>
  );
}
