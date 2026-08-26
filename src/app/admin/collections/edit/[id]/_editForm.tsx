"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { updateCollectionAction } from "../../_actions";
import { type Author } from "@/types/Author";
import styles from "../../../_formStyles.module.scss";
import Image from "next/image";
import { uploadToCloudinary } from "~/lib/cloudinary-client";
import { useImageCrop } from "~/hooks/use-image-crop";
import ImageCropModal from "~/components/ui/ImageCropModal/LazyImageCropModal";
import { useSetBreadcrumb } from "@/app/admin/_components/BreadcrumbContext";
import { ArrowLeft, Save } from "lucide-react";

type CollectionForEdit = {
  id: number;
  title: string;
  titleUk?: string | null;
  authorId: number;
  coverPhotoUrl: string | null;
};

export default function CollectionEditForm({
  collection,
  authors,
}: {
  collection: CollectionForEdit;
  authors: Author[];
}) {
  useSetBreadcrumb(collection.title);
  const [state, formAction] = useActionState(updateCollectionAction, undefined);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(collection.coverPhotoUrl ?? "");
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
    try {
      const secureUrl = await uploadToCloudinary(file, "voytart/collections");
      setCoverPhotoUrl(secureUrl);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      setPreview(null);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const actionData = new FormData(e.currentTarget);
    startTransition(() => formAction(actionData));
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* ── Sticky Top Bar ─────────────────────────────────── */}
      <div className={styles.formHeaderSticky}>
        <div className={styles.headerTitleWrap}>
          <Link href="/admin/collections" className={styles.cancelBtn} style={{ padding: "0.5rem 0.75rem" }}>
            <ArrowLeft size={16} />
            <span>До списку</span>
          </Link>
          <div>
            <h1 className={styles.headerTitle}>Редагування колекції: {collection.title}</h1>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
              ID: #{collection.id}
            </p>
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={pending || uploading}
        >
          <Save size={16} />
          <span>{uploading ? "Завантаження фото..." : pending ? "Збереження..." : "Зберегти"}</span>
        </button>
      </div>

      {state?.error && <p className={styles.error}>{state.error}</p>}
      <input type="hidden" name="id" value={String(collection.id)} />
      <input type="hidden" name="coverPhotoUrl" value={coverPhotoUrl} />

      {/* ── 2-Column Grid Layout ───────────────────────────── */}
      <div className={styles.formGrid}>
        {/* Main Column */}
        <div className={styles.mainColumn}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Основні параметри</h3>
              <span className={styles.cardDesc}>Назва та автор колекції</span>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Назва колекції (EN) *</label>
              <input
                className={styles.input}
                name="title"
                placeholder="Collection title in English"
                defaultValue={collection.title}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Назва колекції (Українська)</label>
              <input
                className={styles.input}
                name="titleUk"
                placeholder="Назва колекції українською"
                defaultValue={collection.titleUk ?? ""}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Автор *</label>
              <select
                className={styles.select}
                name="authorId"
                defaultValue={String(collection.authorId)}
                required
              >
                <option value="">Оберіть автора</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.firstName} {a.lastName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className={styles.sidebarColumn}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Обкладинка колекції</h3>
            </div>

            <div className={styles.field}>
              {coverPhotoUrl && !preview && (
                <div className={styles.previewWrap} style={{ marginBottom: "0.75rem" }}>
                  <Image
                    src={coverPhotoUrl}
                    alt={collection.title}
                    width={200}
                    height={200}
                    style={{ objectFit: "cover", borderRadius: "6px" }}
                  />
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
                  <div className={styles.previewWrap}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="preview" className={styles.previewImg} />
                  </div>
                ) : (
                  <span>Замінити обкладинку</span>
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
                <button
                  type="button"
                  className={styles.submitBtn}
                  disabled={uploading}
                  onClick={() => void handleUpload()}
                  style={{ marginTop: "0.75rem", width: "100%" }}
                >
                  {uploading ? "Завантаження..." : "Завантажити нове фото"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
        <Link href="/admin/collections" className={styles.cancelBtn}>
          Скасувати
        </Link>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={pending || uploading}
        >
          <Save size={16} />
          <span>{uploading ? "Завантаження..." : pending ? "Збереження..." : "Зберегти зміни"}</span>
        </button>
      </div>
    </form>
  );
}
