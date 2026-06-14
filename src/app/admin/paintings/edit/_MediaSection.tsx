"use client";
import { useRef, useState, useTransition } from "react";
import { addPaintingMediaAction, deletePaintingMediaAction } from "./_media-actions";
import styles from "../paintings.module.scss";
import { uploadToCloudinary } from "~/lib/cloudinary-client";

type MediaItem = { id: number; url: string; isNeon: boolean; order: number; type: "IMAGE" | "VIDEO" };

export default function MediaSection({
  paintingId,
  items,
  isNeon,
}: {
  paintingId: number;
  items: MediaItem[];
  isNeon: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "video" | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function validateFile(file: File): boolean {
    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    
    if (isVideo) {
      const maxSize = 15 * 1024 * 1024; // 15 MB
      if (file.size > maxSize) {
        const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
        alert(
          `Помилка: Відео занадто велике (${sizeInMb} MB).\n\n` +
          `Максимальний дозволений розмір для відео — 15 MB.\n` +
          `Будь ласка, стисніть це відео перед завантаженням (наприклад, скористайтеся безкоштовним сервісом clideo.com або online-convert.com).`
        );
        return false;
      }
    } else if (isImage) {
      const maxSize = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxSize) {
        const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
        alert(
          `Помилка: Зображення занадто велике (${sizeInMb} MB).\n\n` +
          `Максимальний дозволений розмір для зображення — 5 MB.\n` +
          `Будь ласка, зменшіть роздільну здатність або стисніть фото перед завантаженням.`
        );
        return false;
      }
    }
    return true;
  }

  async function handleUpload() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    setUploading(true);
    let secureUrl = "";
    const resourceType = file.type.startsWith("video/") ? "video" : "image";
    try {
      secureUrl = await uploadToCloudinary(file, "voytart/paintings", resourceType);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Не вдалося завантажити файл на Cloudinary. Спробуйте ще раз.");
      setUploading(false);
      return;
    }
    setUploading(false);

    const fd = new FormData();
    fd.set("paintingId", String(paintingId));
    fd.set("url", secureUrl);
    fd.set("isNeon", String(isNeon));
    fd.set("type", file.type.startsWith("video/") ? "VIDEO" : "IMAGE");

    startTransition(() => {
      void addPaintingMediaAction(fd);
    });

    setPreview(null);
    setPreviewType(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!validateFile(file)) {
      if (fileInputRef.current) fileInputRef.current.value = "";
      setPreview(null);
      setPreviewType(null);
      return;
    }

    const dt = new DataTransfer();
    dt.items.add(file);
    if (fileInputRef.current) fileInputRef.current.files = dt.files;
    setPreview(URL.createObjectURL(file));
    setPreviewType(file.type.startsWith("video/") ? "video" : "image");
  }

  function handleDelete(id: number) {
    const fd = new FormData();
    fd.set("id", String(id));
    fd.set("paintingId", String(paintingId));
    startTransition(() => {
      void deletePaintingMediaAction(fd);
    });
  }

  return (
    <div className={styles.mediaSection}>
      <p className={styles.mediaSectionTitle}>
        {isNeon ? "Неонові медіа" : "Медіа картини"}
      </p>

      {items.length > 0 && (
        <div className={styles.mediaGrid}>
          {items.map((item) => (
            <div key={item.id} className={styles.mediaItem}>
              {item.type === "VIDEO" ? (
                <div style={{ width: 80, height: 80, background: "#111", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem" }}>
                  🎬
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt="" className={styles.mediaThumbnail} />
              )}
              <button
                type="button"
                className={styles.mediaDelete}
                onClick={() => handleDelete(item.id)}
                disabled={pending}
                aria-label="Видалити"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        className={`${styles.dropZone} ${dragOver ? styles.dragOver : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          previewType === "video" ? (
            <video src={preview} className={styles.preview} controls muted style={{ maxHeight: "200px" }} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" className={styles.preview} />
          )
        ) : (
          <span>
            {isNeon ? "Додати неонове фото" : "Додати фото/відео"}
          </span>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (!validateFile(file)) {
              if (fileInputRef.current) fileInputRef.current.value = "";
              setPreview(null);
              setPreviewType(null);
              return;
            }

            setPreview(URL.createObjectURL(file));
            setPreviewType(file.type.startsWith("video/") ? "video" : "image");
          }}
        />
      </div>

      {preview && (
        <button
          type="button"
          className={styles.button}
          disabled={uploading || pending}
          onClick={() => void handleUpload()}
        >
          {uploading ? "Завантаження..." : pending ? "Збереження..." : "Додати"}
        </button>
      )}
    </div>
  );
}
