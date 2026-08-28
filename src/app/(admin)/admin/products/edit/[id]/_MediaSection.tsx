"use client";

import { useRef, useState, useTransition } from "react";
import {
  addProductMediaAction,
  updateProductMediaVariantAction,
  deleteProductMediaAction,
} from "../../_media-actions";
import styles from "../../../_formStyles.module.scss";
import { uploadToCloudinary } from "~/lib/cloudinary-client";
import { useImageCrop } from "~/hooks/use-image-crop";
import ImageCropModal from "~/components/ui/ImageCropModal/LazyImageCropModal";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import { Trash2, Tag, UploadCloud } from "lucide-react";

type MediaItem = { id: number; url: string; order: number; variantId?: number | null };
type VariantOption = { id: number; title: string };

export default function MediaSection({
  productId,
  items,
  variants = [],
}: {
  productId: number;
  items: MediaItem[];
  variants?: VariantOption[];
}) {
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedVariantForNew, setSelectedVariantForNew] = useState<string>("");
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
  });

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
    if (selectedVariantForNew) {
      fd.set("variantId", selectedVariantForNew);
    }

    startTransition(() => {
      void addProductMediaAction(fd);
    });

    setPreview(null);
    setSelectedVariantForNew("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleVariantChange(mediaId: number, variantIdVal: string) {
    const variantId = variantIdVal ? Number(variantIdVal) : null;
    startTransition(() => {
      void updateProductMediaVariantAction(mediaId, productId, variantId);
    });
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
    <div className={styles.card} style={{ marginTop: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h3 className={styles.cardTitle} style={{ border: "none", padding: 0 }}>
            Галерея фото товару та привʼязка до варіантів
          </h3>
          <p style={{ fontSize: "0.825rem", color: "#64748b", margin: "0.25rem 0 0" }}>
            Ви можете привʼязати кожне фото до конкретного кольору/розміру, щоб галерея перемикалася автоматично при виборі покупцем.
          </p>
        </div>
      </div>

      {items.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                position: "relative",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "0.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1/1",
                  borderRadius: "6px",
                  overflow: "hidden",
                  background: "#e2e8f0",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getOptimizedImageUrl(item.url, { preset: "thumb" })}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    background: "rgba(239, 68, 68, 0.9)",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    width: "28px",
                    height: "28px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                  }}
                  onClick={() => handleDelete(item.id)}
                  disabled={pending}
                  title="Видалити фото"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Variant Selector for this Image */}
              {variants.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  <label
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      color: "#64748b",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                    }}
                  >
                    <Tag size={11} />
                    <span>Привʼязка:</span>
                  </label>
                  <select
                    className={styles.select}
                    style={{
                      padding: "0.3rem 0.5rem",
                      fontSize: "0.78rem",
                      borderRadius: "6px",
                      background: item.variantId ? "#eff6ff" : "#ffffff",
                      borderColor: item.variantId ? "#93c5fd" : "#cbd5e1",
                    }}
                    value={item.variantId ?? ""}
                    onChange={(e) => handleVariantChange(item.id, e.target.value)}
                    disabled={pending}
                  >
                    <option value="">Усі варіанти (загальне)</option>
                    {variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.title}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <span style={{ fontSize: "0.75rem", color: "#94a3b8", textAlign: "center" }}>
                  Загальне фото
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Drop Zone */}
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
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="preview" className={styles.preview} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
            <UploadCloud size={28} color="#64748b" />
            <span>Перетягніть або клікніть для додавання нового фото в галерею</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
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
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginTop: "1rem" }}>
          {variants.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#334155" }}>
                Привʼязати це нове фото до:
              </span>
              <select
                className={styles.select}
                style={{ width: "auto", padding: "0.45rem 0.75rem", fontSize: "0.85rem" }}
                value={selectedVariantForNew}
                onChange={(e) => setSelectedVariantForNew(e.target.value)}
              >
                <option value="">Усі варіанти (загальне)</option>
                {variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            className={styles.submitBtn}
            style={{ width: "auto", padding: "0.5rem 1.25rem" }}
            disabled={uploading || pending}
            onClick={() => void handleUpload()}
          >
            {uploading ? "Завантаження..." : pending ? "Збереження..." : "Завантажити фото"}
          </button>
        </div>
      )}
    </div>
  );
}
