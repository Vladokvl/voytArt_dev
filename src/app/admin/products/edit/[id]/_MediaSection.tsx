"use client";
import { useRef, useState, useTransition } from "react";
import { addProductMediaAction, deleteProductMediaAction } from "../../_media-actions";
import styles from "../../../_formStyles.module.scss";
import { uploadToCloudinary } from "~/lib/cloudinary-client";

type MediaItem = { id: number; url: string; order: number };

export default function MediaSection({
  productId,
  items,
}: {
  productId: number;
  items: MediaItem[];
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
      secureUrl = await uploadToCloudinary(file, "voytart/products");
    } catch (err) {
      console.error(err);
      setUploading(false);
      return;
    }
    setUploading(false);

    const fd = new FormData();
    fd.set("productId", String(productId));
    fd.set("url", secureUrl);

    startTransition(() => {
      void addProductMediaAction(fd);
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
    fd.set("productId", String(productId));
    startTransition(() => {
      void deleteProductMediaAction(fd);
    });
  }

  return (
    <div className={styles.mediaSection} style={{ marginTop: "32px" }}>
      <p style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "16px" }}>
        Медіа (додаткові фото)
      </p>

      {items.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
          {items.map((item) => (
            <div key={item.id} style={{ position: "relative", width: "120px", height: "120px" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} />
              <button
                type="button"
                style={{
                  position: "absolute", top: "4px", right: "4px",
                  background: "rgba(0,0,0,0.6)", color: "white",
                  border: "none", borderRadius: "50%", width: "24px", height: "24px",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                }}
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
          <span>Додати фото</span>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
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
          className={styles.submitBtn}
          style={{ marginTop: "16px" }}
          disabled={uploading || pending}
          onClick={() => void handleUpload()}
        >
          {uploading ? "Завантаження..." : pending ? "Збереження..." : "Додати"}
        </button>
      )}
    </div>
  );
}
