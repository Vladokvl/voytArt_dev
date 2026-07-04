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

  return new Promise<File>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas порожній"));
          return;
        }
        // Save as jpeg to optimize size
        const file = new File([blob], fileName.replace(/\.[^/.]+$/, "") + ".jpg", {
          type: "image/jpeg",
          lastModified: Date.now(),
        });
        resolve(file);
      },
      "image/jpeg",
      quality
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
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(undefined); // Free by default
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [quality, setQuality] = useState(0.8); // Default quality 80%
  const [compressedSize, setCompressedSize] = useState<number | null>(null);
  const [isCompressing, startCompression] = useTransition();
  const [originalAspect, setOriginalAspect] = useState<number | undefined>(undefined);

  const originalSizeMb = imageFile.size / (1024 * 1024);

  // Generate URL for crop library
  useEffect(() => {
    const url = URL.createObjectURL(imageFile);
    setImageSrc(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

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
            imageFile.name
          );
          setCompressedSize(file.size);
        } catch (e) {
          console.error("Помилка розрахунку розміру:", e);
        }
      });
    }, 150); // debounce slightly to avoid heavy canvas drawing on fast slider movements

    return () => clearTimeout(timer);
  }, [croppedAreaPixels, quality, imageSrc, imageFile.name]);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    try {
      const croppedFile = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        quality,
        imageFile.name
      );
      onCropSave(croppedFile);
    } catch (e) {
      console.error(e);
      alert("Не вдалося обрізати зображення");
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
              disabled={isTooLarge || isCompressing}
            >
              Зберегти та закрити
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
