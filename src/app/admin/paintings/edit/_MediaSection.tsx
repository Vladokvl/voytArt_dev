"use client";
import { useRef, useState, useTransition } from "react";
import { addPaintingMediaAction, deletePaintingMediaAction } from "./_media-actions";
import styles from "../paintings.module.scss";
import { uploadToCloudinary } from "~/lib/cloudinary-client";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import { useImageCrop } from "~/hooks/use-image-crop";
import ImageCropModal from "~/components/ui/ImageCropModal/ImageCropModal";

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

  const {
    cropFile,
    handleFileChange,
    handleFileDrop,
    onCropSave,
    onCropCancel,
  } = useImageCrop({
    fileInputRef,
    setPreview,
    setPreviewType,
  });

  async function handleUpload() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    let secureUrl = "";
    const resourceType = file.type.startsWith("video/") ? "video" : "image";
    try {
      secureUrl = await uploadToCloudinary(file, "voytart/paintings", resourceType);
    } catch (err) {
      console.error(err);
      const errMsg = err instanceof Error ? err.message : "Не вдалося завантажити файл на Cloudinary. Спробуйте ще раз.";
      alert(errMsg);
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
                <img src={getOptimizedImageUrl(item.url, { preset: "thumb" })} alt="" className={styles.mediaThumbnail} />
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
        onDrop={(e) => {
          setDragOver(false);
          handleFileDrop(e);
        }}
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
          onChange={handleFileChange}
        />
      </div>

      {cropFile && (
        <ImageCropModal
          open={!!cropFile}
          imageFile={cropFile}
          onCropSave={onCropSave}
          onCancel={onCropCancel}
        />
      )}

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
