"use client";
import { useActionState, useRef, useState, useTransition } from "react";
import { updateCollectionAction } from "../../_actions";
import { type Author } from "@/types/Author";
import styles from "../../../_formStyles.module.scss";
import Image from "next/image";
import { uploadToCloudinary } from "~/lib/cloudinary-client";

type CollectionForEdit = {
  id: number;
  title: string;
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
  const [state, formAction] = useActionState(updateCollectionAction, undefined);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);
  const [coverPhotoUrl, setCoverPhotoUrl] = useState(collection.coverPhotoUrl ?? "");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const actionData = new FormData(e.currentTarget);
    startTransition(() => formAction(actionData));
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

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {state?.error && <p className={styles.error}>{state.error}</p>}
      <input type="hidden" name="id" value={String(collection.id)} />
      <input type="hidden" name="coverPhotoUrl" value={coverPhotoUrl} />

      <div className={styles.field}>
        <label className={styles.label}>Назва *</label>
        <input
          className={styles.input}
          name="title"
          placeholder="Назва колекції"
          defaultValue={collection.title}
          required
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

      <div className={styles.field}>
        <label className={styles.label}>Обкладинка</label>
        {coverPhotoUrl && !preview && (
          <Image
            src={coverPhotoUrl}
            alt={collection.title}
            width={200}
            height={200}
            style={{ objectFit: "cover", borderRadius: 6, marginBottom: "0.5rem" }}
          />
        )}
        <div
          className={`${styles.dropZone} ${dragOver ? styles.dragOver : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" className={styles.previewImg} />
          ) : (
            <span>Замінити обкладинку</span>
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
            disabled={uploading}
            onClick={() => void handleUpload()}
            style={{ marginTop: "0.5rem" }}
          >
            {uploading ? "Завантаження..." : "Завантажити фото"}
          </button>
        )}
      </div>

      <button type="submit" className={styles.submitBtn} disabled={pending || uploading}>
        {pending ? "Збереження..." : "Зберегти"}
      </button>
    </form>
  );
}
