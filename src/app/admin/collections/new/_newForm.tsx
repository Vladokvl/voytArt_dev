"use client";
import { useActionState, useRef, useState, useTransition } from "react";
import { createCollectionAction } from "../_actions";
import { type Author } from "@/types/Author";
import styles from "../../_formStyles.module.scss";

export default function CollectionNewForm({ authors }: { authors: Author[] }) {
  const [state, formAction] = useActionState(createCollectionAction, undefined);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("image") as HTMLInputElement;
    const file = fileInput.files?.[0];

    let coverPhotoUrl = "";
    if (file) {
      setUploading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "voytart_unsigned");
      data.append("folder", "voytart/collections");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data },
      );
      const json = (await res.json()) as { secure_url: string };
      coverPhotoUrl = json.secure_url;
      setUploading(false);
    }

    const actionData = new FormData(form);
    actionData.delete("image");
    actionData.set("coverPhotoUrl", coverPhotoUrl);
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

      <div className={styles.field}>
        <label className={styles.label}>Назва *</label>
        <input className={styles.input} name="title" placeholder="Назва колекції" required />
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
          onDrop={handleDrop}
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
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
          />
        </div>
      </div>

      <button type="submit" className={styles.submitBtn} disabled={pending || uploading}>
        {uploading ? "Завантаження..." : pending ? "Збереження..." : "Створити"}
      </button>
    </form>
  );
}
