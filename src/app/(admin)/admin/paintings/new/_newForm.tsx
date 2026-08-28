"use client";
import { useActionState, useRef, useState, useTransition } from "react";
import { createPaintingAction } from "./_actions";
import { type Author } from "@/types/Author";
import styles from "../paintings.module.scss";
import { uploadToCloudinary } from "~/lib/cloudinary-client";
import dynamic from "next/dynamic";

const TipTapEditor = dynamic(() => import("~/components/admin/TipTapEditor"), {
  ssr: false,
  loading: () => (
    <div
      className="skeleton-editor"
      style={{ minHeight: "200px", background: "#f1f5f9", borderRadius: "8px" }}
    />
  ),
});
import { useImageCrop } from "~/hooks/use-image-crop";
import ImageCropModal from "~/components/ui/ImageCropModal/LazyImageCropModal";
import LanguageTabs from "../../_components/LanguageTabs";

export default function PaintingForm({ authors, collections }: { authors: Author[]; collections: { id: number; title: string; authorId: number }[] }) {
  const [state, formAction] = useActionState(createPaintingAction, undefined);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [langTab, setLangTab] = useState<"en" | "uk">("en");
  const [description, setDescription] = useState("");
  const [descriptionUk, setDescriptionUk] = useState("");
  const [selectedAuthorId, setSelectedAuthorId] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState("");

  const filteredCollections = selectedAuthorId
    ? collections.filter((c) => String(c.authorId) === selectedAuthorId)
    : collections;

  function handleAuthorChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newAuthorId = e.target.value;
    setSelectedAuthorId(newAuthorId);
    // скидаємо колекцію якщо вона не належить новому автору
    if (selectedCollectionId) {
      const col = collections.find((c) => String(c.id) === selectedCollectionId);
      if (col && String(col.authorId) !== newAuthorId) {
        setSelectedCollectionId("");
      }
    }
  }

  function handleCollectionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newCollectionId = e.target.value;
    setSelectedCollectionId(newCollectionId);
    // автоматично виставляємо автора з колекції
    if (newCollectionId) {
      const col = collections.find((c) => String(c.id) === newCollectionId);
      if (col) setSelectedAuthorId(String(col.authorId));
    }
  }



  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("image") as HTMLInputElement;
    const file = fileInput.files?.[0];

    setUploading(true);
    let imageUrl = "";

    if (file) {
      try {
        imageUrl = await uploadToCloudinary(file, "voytart/paintings");
      } catch (err) {
        console.error(err);
      }
    }

    setUploading(false);

    const actionData = new FormData(form);
    actionData.delete("image");
    actionData.set("coverUrl", imageUrl);

    startTransition(() => {
      formAction(actionData);
    });
  }

  const [preview, setPreview] = useState<string | null>(null);
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

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {state?.error && <p className={styles.error}>{state.error}</p>}

      <LanguageTabs activeTab={langTab} onChange={setLangTab} />

      <div style={{ display: langTab === "en" ? "block" : "none" }}>
        <div className={styles.field}>
          <label className={styles.label}>Title (EN) *</label>
          <input
            className={styles.input}
            name="title"
            placeholder="Painting title in English"
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description (EN)</label>
          <div className={styles.field}>
            <TipTapEditor
              content={description}
              onChange={(html) => setDescription(html)}
            />
            <input type="hidden" name="description" value={description} />
          </div>
        </div>
      </div>

      <div style={{ display: langTab === "uk" ? "block" : "none" }}>
        <div className={styles.field}>
          <label className={styles.label}>Назва (Українська)</label>
          <input
            className={styles.input}
            name="titleUk"
            placeholder="Назва картини українською"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Опис (Українська)</label>
          <div className={styles.field}>
            <TipTapEditor
              content={descriptionUk}
              onChange={(html) => setDescriptionUk(html)}
            />
            <input type="hidden" name="descriptionUk" value={descriptionUk} />
          </div>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Автор *</label>
        <select
          className={styles.select}
          name="authorId"
          required
          value={selectedAuthorId}
          onChange={handleAuthorChange}
        >
          <option value="">Оберіть автора</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.firstName} {a.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Колекція</label>
        <select
          className={styles.select}
          name="collectionId"
          value={selectedCollectionId}
          onChange={handleCollectionChange}
        >
          <option value="">Без колекції</option>
          {filteredCollections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Рік</label>
          <input
            className={styles.input}
            name="year"
            type="number"
            placeholder="2024"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.checkboxLabel}>
          <input name="hasNeon" type="checkbox" /> Є неонова версія
        </label>
        <label className={styles.checkboxLabel}>
          <input name="isForSale" type="checkbox" /> Продається
        </label>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Фото *</label>
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
            <span>Перетягніть фото або клікніть для вибору</span>
          )}
          <input
            ref={fileInputRef}
            name="image"
            type="file"
            accept="image/*"
            required
            hidden
            onChange={handleFileChange}
          />
        </div>
      </div>

      {cropFile && (
        <ImageCropModal
          open={!!cropFile}
          imageFile={cropFile}
          onCropSave={onCropSave}
          onCancel={onCropCancel}
        />
      )}

      <button
        type="submit"
        className={styles.button}
        disabled={pending || uploading}
      >
        {uploading
          ? "Завантаження фото..."
          : pending
            ? "Збереження..."
            : "Зберегти"}
      </button>
    </form>
  );
}
