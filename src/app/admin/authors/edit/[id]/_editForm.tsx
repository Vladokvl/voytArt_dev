"use client";
import { useActionState, useRef, useState, useTransition } from "react";
import { updateAuthorAction } from "../../_actions";
import styles from "@/app/admin/_formStyles.module.scss";

type Author = { id: number; firstName: string; lastName: string; bio: string | null; photoUrl: string | null };

export default function AuthorEditForm({ author }: { author: Author }) {
  const [state, formAction] = useActionState(updateAuthorAction, undefined);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(author.photoUrl);
  const [dragOver, setDragOver] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(author.photoUrl ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("image") as HTMLInputElement;
    const file = fileInput.files?.[0];

    let finalPhotoUrl = photoUrl;

    if (file) {
      setUploading(true);
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "voytart_unsigned");
      data.append("folder", "voytart/authors");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data },
      );
      const json = (await res.json()) as { secure_url: string };
      finalPhotoUrl = json.secure_url;
      setPhotoUrl(finalPhotoUrl);
      setUploading(false);
    }

    const actionData = new FormData(form);
    actionData.delete("image");
    actionData.set("photoUrl", finalPhotoUrl);

    startTransition(() => formAction(actionData));
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Редагувати автора</h1>
      {state?.error && <p className={styles.error}>{state.error}</p>}
      <input type="hidden" name="id" value={author.id} />

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Імʼя *</label>
          <input className={styles.input} name="firstName" defaultValue={author.firstName} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Прізвище *</label>
          <input className={styles.input} name="lastName" defaultValue={author.lastName} required />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Біографія</label>
        <textarea className={styles.textarea} name="bio" defaultValue={author.bio ?? ""} />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Фото</label>
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
            <span>Перетягни нове фото або клікни для вибору</span>
          )}
        </div>
        <input ref={fileInputRef} type="file" name="image" accept="image/*" style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setPreview(URL.createObjectURL(f));
          }}
        />
        <input type="hidden" name="photoUrl" value={photoUrl} />
      </div>

      <button type="submit" className={styles.submitBtn} disabled={uploading || pending}>
        {uploading ? "Завантаження фото..." : pending ? "Збереження..." : "Зберегти зміни"}
      </button>
    </form>
  );
}
