"use client";
import { useActionState, useRef, useState, useTransition } from "react";
import { createPostAction } from "../_actions";
import styles from "../../_formStyles.module.scss";
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
import ImageCropModal from "~/components/ui/ImageCropModal/ImageCropModal";

export default function PostForm() {
  const [state, formAction] = useActionState(createPostAction, undefined);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [content, setContent] = useState("");
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

    setUploading(true);
    let coverUrl = "";

    if (file) {
      try {
        coverUrl = await uploadToCloudinary(file, "voytart/posts");
      } catch (err) {
        console.error(err);
      }
    }

    setUploading(false);

    const actionData = new FormData(form);
    actionData.delete("image");
    actionData.set("coverUrl", coverUrl);

    startTransition(() => formAction(actionData));
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Новий пост</h1>
      {state?.error && <p className={styles.error}>{state.error}</p>}

      <div className={styles.field}>
        <label className={styles.label}>Заголовок *</label>
        <input className={styles.input} name="title" placeholder="Заголовок" required />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Дата</label>
        <input className={styles.input} name="date" type="date" />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Контент *</label>
        <TipTapEditor
          content={content}
          onChange={(html) => setContent(html)}
        />
        <input type="hidden" name="content" value={content} />
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
            <span>Перетягни обкладинку або клікни для вибору</span>
          )}
        </div>
        <input ref={fileInputRef} type="file" name="image" accept="image/*" style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <input type="hidden" name="coverUrl" />
      </div>

      {cropFile && (
        <ImageCropModal
          open={!!cropFile}
          imageFile={cropFile}
          onCropSave={onCropSave}
          onCancel={onCropCancel}
        />
      )}

      <button type="submit" className={styles.submitBtn} disabled={uploading || pending}>
        {uploading ? "Завантаження фото..." : pending ? "Збереження..." : "Зберегти"}
      </button>
    </form>
  );
}
