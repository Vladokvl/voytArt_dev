"use client";

import React, { useState, useEffect, useTransition } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Cropper, { type Area } from "react-easy-crop";
import styles from "./ImageCropModal.module.scss";

// Helper function to crop and compress image
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  quality: number, // 0.1 to 1.0
  fileName: string
): Promise<File> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", () => reject(new Error("Не вдалося завантажити зображення")));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Не вдалося створити контекст 2D для canvas");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  // Очищення canvas (для прозорого PNG фону)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  // Визначаємо формат файлу (для збереження прозорості)
  const isPng = fileName.toLowerCase().endsWith(".png");
  const mimeType = isPng ? "image/png" : "image/jpeg";
  const outputFileName = isPng
    ? fileName.replace(/\.[^/.]+$/, "") + ".png"
    : fileName.replace(/\.[^/.]+$/, "") + ".jpg";

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas порожній"));
          return;
        }
        const file = new File([blob], outputFileName, {
          type: mimeType,
          lastModified: Date.now(),
        });
        resolve(file);
      },
      mimeType,
      mimeType === "image/jpeg" ? quality : undefined
    );
  });
}

interface ImageCropModalProps {
  open: boolean;
  imageFile: File;
  onCropSave: (croppedFile: File) => void;
  onCancel: () => void;
  maxSizeMb?: number;
}

export default function ImageCropModal({
  open,
  imageFile,
  onCropSave,
  onCancel,
  maxSizeMb = 5,
}: ImageCropModalProps) {
  // Локальний стан файлу (для заміни на версію без фону)
  const [currentFile, setCurrentFile] = useState<File>(imageFile);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(undefined); // Free by default
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [quality, setQuality] = useState(0.8); // Default quality 80%
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [isCompressing, startCompression] = useTransition();
  const [originalAspect, setOriginalAspect] = useState<number | undefined>(undefined);

  // Стани AI-видалення фону
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [bgProgress, setBgProgress] = useState<number | null>(null);
  const [bgRemovalError, setBgRemovalError] = useState<string | null>(null);

  const originalSizeMb = currentFile.size / (1024 * 1024);

  // Синхронізація локального файлу при зміні пропу
  useEffect(() => {
    setCurrentFile(imageFile);
    setBgRemovalError(null);
    setBgProgress(null);
  }, [imageFile]);

  // Generate URL for crop library
  useEffect(() => {
    const url = URL.createObjectURL(currentFile);
    setImageSrc(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [currentFile]);

  // Handle cropping completion event
  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Recalculate compressed size in the background when crop or quality changes
  useEffect(() => {
    if (!imageSrc || !croppedAreaPixels) return;

    const timer = setTimeout(() => {
      startCompression(async () => {
        try {
          const file = await getCroppedImg(
            imageSrc,
            croppedAreaPixels,
            quality,
            currentFile.name
          );
          setCompressedSize(file.size);
        } catch (e) {
          console.error("Помилка розрахунку розміру:", e);
        }
      });
    }, 150); // debounce slightly to avoid heavy canvas drawing on fast slider movements

    return () => clearTimeout(timer);
  }, [croppedAreaPixels, quality, imageSrc, currentFile.name]);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedFile = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        quality,
        currentFile.name
      );
      onCropSave(croppedFile);
    } catch (e) {
      console.error(e);
      alert("Не вдалося обрізати зображення");
    }
  };

  // Функція виклику нейромережі видалення фону
  const handleRemoveBackground = async () => {
    setIsRemovingBg(true);
    setBgProgress(0);
    setBgRemovalError(null);
    try {
      // Динамічний імпорт для збереження швидкості завантаження сторінки
      const { removeBackground } = await import("@imgly/background-removal");
      
      const blob = await removeBackground(currentFile, {
        progress: (key, current, total) => {
          const pct = Math.round((current / total) * 100);
          setBgProgress(pct);
        }
      });

      const noBgFile = new File(
        [blob],
        currentFile.name.replace(/\.[^/.]+$/, "") + "-nobg.png",
        {
          type: "image/png",
          lastModified: Date.now(),
        }
      );

      setCurrentFile(noBgFile);
      setBgProgress(null);
    } catch (err) {
      console.error("Помилка видалення фону:", err);
      setBgRemovalError("Не вдалося видалити фон. Спробуйте інше фото.");
      setBgProgress(null);
    } finally {
      setIsRemovingBg(false);
    }
  };

  const formattedOriginalSize = originalSizeMb.toFixed(2);
  const formattedCompressedSize = compressedSize
    ? (compressedSize / (1024 * 1024)).toFixed(2)
    : null;

  const isTooLarge = compressedSize ? compressedSize > maxSizeMb * 1024 * 1024 : false;

  return (
    <Dialog.Root open={open} onOpenChange={(val) => !val && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.modal}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>Редагування та стиснення фото</Dialog.Title>
            <button className={styles.closeBtn} onClick={onCancel} aria-label="Закрити">
              ✕
            </button>
          </div>

          <div className={styles.body}>
            {/* Cropper container */}
            <div className={styles.cropperContainer}>
              {imageSrc && (
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspect}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                  onMediaLoaded={(mediaSize) => {
                    setOriginalAspect(mediaSize.naturalWidth / mediaSize.naturalHeight);
                  }}
                />
              )}
            </div>

            {/* Controls sidebar */}
            <div className={styles.sidebar}>
              {/* Aspect Ratio Selector */}
              <div className={styles.section}>
                <span className={styles.sectionLabel}>Формат (Aspect Ratio)</span>
                <div className={styles.buttonGrid}>
                  <button
                    type="button"
                    className={`${styles.ratioBtn} ${aspect === undefined ? styles.ratioBtnActive : ""}`}
                    onClick={() => setAspect(undefined)}
                  >
                    Вільний
                  </button>
                  <button
                    type="button"
                    className={`${styles.ratioBtn} ${aspect === 1 ? styles.ratioBtnActive : ""}`}
                    onClick={() => setAspect(1)}
                  >
                    1:1 (Квадрат)
                  </button>
                  <button
                    type="button"
                    className={`${styles.ratioBtn} ${aspect === 4 / 3 ? styles.ratioBtnActive : ""}`}
                    onClick={() => setAspect(4 / 3)}
                  >
                    4:3
                  </button>
                  <button
                    type="button"
                    className={`${styles.ratioBtn} ${aspect === 16 / 9 ? styles.ratioBtnActive : ""}`}
                    onClick={() => setAspect(16 / 9)}
                  >
                    16:9
                  </button>
                  <button
                    type="button"
                    className={`${styles.ratioBtn} ${aspect === 9 / 16 ? styles.ratioBtnActive : ""}`}
                    onClick={() => setAspect(9 / 16)}
                  >
                    9:16 (Story)
                  </button>
                  <button
                    type="button"
                    className={`${styles.ratioBtn} ${aspect === originalAspect ? styles.ratioBtnActive : ""}`}
                    onClick={() => originalAspect && setAspect(originalAspect)}
                    disabled={!originalAspect}
                  >
                    Оригінальний
                  </button>
                </div>
              </div>

              {/* AI Tools (Background Removal) */}
              <div className={styles.section}>
                <span className={styles.sectionLabel}>AI Інструменти</span>
                <button
                  type="button"
                  onClick={handleRemoveBackground}
                  disabled={isRemovingBg}
                  style={{
                    width: "100%",
                    padding: "0.65rem",
                    background: isRemovingBg ? "#333" : "#d7ff01",
                    color: isRemovingBg ? "#aaa" : "#000",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 600,
                    cursor: isRemovingBg ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    transition: "all 0.2s ease"
                  }}
                >
                  {isRemovingBg ? (
                    <span>Обробка: {bgProgress !== null ? `${bgProgress}%` : "запуск..."}</span>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="6" cy="6" r="3"></circle>
                        <circle cx="6" cy="18" r="3"></circle>
                        <line x1="20" y1="4" x2="8.12" y2="15.88"></line>
                        <line x1="14.47" y1="14.48" x2="20" y2="20"></line>
                        <line x1="8.12" y1="8.12" x2="12" y2="12"></line>
                      </svg>
                      <span>Видалити фон (AI)</span>
                    </>
                  )}
                </button>
                {bgRemovalError && (
                  <div style={{ color: "#ff6b6b", fontSize: "0.75rem", marginTop: "0.35rem" }}>
                    ⚠️ {bgRemovalError}
                  </div>
                )}
              </div>

              {/* Zoom Slider */}
              <div className={styles.section}>
                <div className={styles.sliderLabelRow}>
                  <span>Масштабування</span>
                  <span>{zoom.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className={styles.slider}
                />
              </div>

              {/* Quality/Compression Slider */}
              <div className={styles.section}>
                <div className={styles.sliderLabelRow}>
                  <span>Якість (стиснення)</span>
                  <span>{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.2}
                  max={1.0}
                  step={0.05}
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className={styles.slider}
                />
              </div>

              {/* Statistics & Limits */}
              <div className={styles.infoBox}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Оригінал:</span>
                  <span className={styles.infoVal}>{formattedOriginalSize} MB</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Стиснутий варіант:</span>
                  <span className={`${styles.infoVal} ${isCompressing ? styles.pulse : ""}`}>
                    {formattedCompressedSize ? `${formattedCompressedSize} MB` : "рахується..."}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Ліміт сайту:</span>
                  <span className={styles.infoVal}>{maxSizeMb} MB</span>
                </div>

                <div className={styles.limitStatus}>
                  {isTooLarge ? (
                    <div className={styles.statusError}>
                      ⚠️ Файл занадто великий! Знизьте якість або зменшіть область обрізки.
                    </div>
                  ) : (
                    <div className={styles.statusOk}>
                      ✅ Розмір файлу в межах норми
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onCancel}>
              Скасувати
            </button>
            <button
              type="button"
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={isTooLarge || isCompressing || isRemovingBg}
            >
              Зберегти та закрити
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
