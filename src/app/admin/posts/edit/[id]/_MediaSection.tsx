"use client";
import { useRef, useState, useTransition } from "react";
import { addPostMediaAction, deletePostMediaAction } from "./_media-actions";
import styles from "@/app/admin/_formStyles.module.scss";
import { uploadToCloudinary } from "~/lib/cloudinary-client";

type MediaItem = { id: number; url: string; type: "IMAGE" | "VIDEO"; order: number };

export default function PostMediaSection({
  postId,
  items,
}: {
  postId: number;
  items: MediaItem[];
}) {
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [mediaType, setMediaType] = useState<"IMAGE" | "VIDEO">("IMAGE");
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const folder = mediaType === "VIDEO" ? "voytart/posts/videos" : "voytart/posts/images";
  const accept = mediaType === "VIDEO" ? "video/*" : "image/*";
  const resourceType = mediaType === "VIDEO" ? "video" : "image";

  async function handleUpload() {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    let secureUrl = "";
    try {
      secureUrl = await uploadToCloudinary(file, folder, resourceType);
    } catch (err) {
      console.error(err);
      setUploading(false);
      return;
    }
    setUploading(false);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    const fd = new FormData();
    fd.set("postId", String(postId));
    fd.set("url", secureUrl);
    fd.set("type", mediaType);
    startTransition(() => { void addPostMediaAction(fd); });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    const dt = new DataTransfer();
    dt.items.add(file);
    if (fileInputRef.current) fileInputRef.current.files = dt.files;
    if (mediaType === "IMAGE") setPreview(URL.createObjectURL(file));
    else setPreview(file.name);
  }

  return (
    <div className={styles.dropZone} style={{ background: "#fafafa", padding: "1.25rem", cursor: "default" }}>
      <p style={{ fontWeight: 600, fontSize: "0.875rem", marginBottom: "0.75rem", color: "#374151" }}>
        Медіа до поста
      </p>

      {/* Тип файлу */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "0.75rem", fontSize: "0.875rem" }}>
        {(["IMAGE", "VIDEO"] as const).map((t) => (
          <label key={t} style={{ display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer" }}>
            <input
              type="radio"
              name={`mediaType-${postId}`}
              checked={mediaType === t}
              onChange={() => { setMediaType(t); setPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
            />
            {t === "IMAGE" ? "Зображення" : "Відео"}
          </label>
        ))}
      </div>

      {/* Drop zone */}
      <div
        className={dragOver ? `${styles.dropZone} ${styles.dragOver}` : styles.dropZone}
        style={{ marginBottom: "0.75rem" }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {preview && mediaType === "IMAGE" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="preview" className={styles.previewImg} />
        ) : preview ? (
          <span style={{ fontSize: "0.875rem" }}>📹 {preview}</span>
        ) : (
          <span>Перетягніть файл або клікніть</span>
        )}
        <input ref={fileInputRef} type="file" accept={accept} hidden onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          if (mediaType === "IMAGE") setPreview(URL.createObjectURL(f));
          else setPreview(f.name);
        }} />
      </div>

      <button
        type="button"
        className={styles.submitBtn}
        disabled={uploading || pending}
        onClick={() => void handleUpload()}
        style={{ marginBottom: "1.25rem" }}
      >
        {uploading ? "Завантаження..." : pending ? "Збереження..." : "Додати"}
      </button>

      {/* Список завантажених */}
      {items.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem" }}>
          {items.map((item) => (
            <div key={item.id} style={{ position: "relative", width: 80, height: 80, borderRadius: 6, overflow: "visible" }}>
              {item.type === "VIDEO" ? (
                <div style={{ width: 80, height: 80, background: "#111", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem" }}>
                  🎬
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt="" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6, display: "block" }} />
              )}
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  const fd = new FormData();
                  fd.set("id", String(item.id));
                  fd.set("postId", String(postId));
                  startTransition(() => { void deletePostMediaAction(fd); });
                }}
                style={{ position: "absolute", top: -6, right: -6, width: 20, height: 20, borderRadius: "50%", background: "#ef4444", color: "#fff", border: "none", cursor: "pointer", fontSize: "0.6rem", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
