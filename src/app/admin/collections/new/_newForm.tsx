"use client";
import { useActionState, useRef, useState, useTransition } from "react";
import { createCollectionAction } from "../_actions";
import { type Author } from "@/types/Author";
import styles from "../../_formStyles.module.scss";
import { uploadToCloudinary } from "~/lib/cloudinary-client";
import { useImageCrop } from "~/hooks/use-image-crop";
import ImageCropModal from "~/components/ui/ImageCropModal/ImageCropModal";

export default function CollectionNewForm({ authors }: { authors: Author[] }) {
  const [state, formAction] = useActionState(createCollectionAction, undefined);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("image") as HTMLInputElement;
    const file = fileInput.files?.[0];

    let coverPhotoUrl = "";
    if (file) {
      setUploading(true);
      try {
        coverPhotoUrl = await uploadToCloudinary(file, "voytart/collections");
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    }

    const actionData = new FormData(form);
    actionData.delete("image");
    actionData.set("coverPhotoUrl", coverPhotoUrl);
    startTransition(() => formAction(actionData));
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {state?.error && <p className={styles.error}>{state.error}</p>}

      <div className={styles.field}>
        <label className={styles.label}>Назва (EN) *</label>
        <input className={styles.input} name="title" placeholder="Collection title in English" required />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Назва (Українська)</label>
        <input className={styles.input} name="titleUk" placeholder="Назва колекції українською" />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Автор *</label>
        <select className={styles.select} name="authorId" required>
          <option value="">Оберіть автора</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.firstName} {a.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Обкладинка</label>
        <div
          className={`${styles.dropZone} ${dragOver ? styles.dragOver : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            setDragOver(false);
            handleFileDrop(e);
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" className={styles.previewImg} />
          ) : (
            <span>Перетягніть фото або клікніть для вибору</span>
          )}
          <input
            ref={fileInputRef}
            name="image"
            type="file"
            accept="image/*"
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

      <button type="submit" className={styles.submitBtn} disabled={pending || uploading}>
        {uploading ? "Завантаження..." : pending ? "Збереження..." : "Створити"}
      </button>
    </form>
  );
}
