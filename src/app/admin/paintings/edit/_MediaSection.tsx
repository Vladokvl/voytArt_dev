"use client";
import { useRef, useState, useTransition } from "react";
import { addPaintingMediaAction, deletePaintingMediaAction } from "./_media-actions";
import styles from "../paintings.module.scss";
import { uploadToCloudinary } from "~/lib/cloudinary-client";

type MediaItem = { id: number; url: string; isNeon: boolean; order: number };

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
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    let secureUrl = "";
    try {
      secureUrl = await uploadToCloudinary(file, "voytart/paintings");
    } catch (err) {
      console.error(err);
      setUploading(false);
      return;
    }
    setUploading(false);

    const fd = new FormData();
    fd.set("paintingId", String(paintingId));
    fd.set("url", secureUrl);
    fd.set("isNeon", String(isNeon));

    startTransition(() => {
      void addPaintingMediaAction(fd);
    });

    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    if (fileInputRef.current) fileInputRef.current.files = dt.files;
    setPreview(URL.createObjectURL(file));
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="" className={styles.mediaThumbnail} />
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
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="preview" className={styles.preview} />
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
            if (file) setPreview(URL.createObjectURL(file));
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
