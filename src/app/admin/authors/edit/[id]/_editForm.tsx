"use client";
import { useActionState, useRef, useState, useTransition } from "react";
import { updateAuthorAction } from "../../_actions";
import styles from "@/app/admin/_formStyles.module.scss";
import { uploadToCloudinary } from "~/lib/cloudinary-client";
import { useImageCrop } from "~/hooks/use-image-crop";
import ImageCropModal from "~/components/ui/ImageCropModal/ImageCropModal";

type Author = {
  id: number;
  firstName: string;
  lastName: string;
  bio: string | null;
  photoUrl: string | null;
  bgPhotoUrl: string | null;
  order: number;
  active: boolean;
};

export default function AuthorEditForm({ author }: { author: Author }) {
  const [state, formAction] = useActionState(updateAuthorAction, undefined);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  // Портрет (з кропом)
  const [preview, setPreview] = useState<string | null>(author.photoUrl);
  const [dragOver, setDragOver] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(author.photoUrl ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Фон (без кропу)
  const [bgPreview, setBgPreview] = useState<string | null>(author.bgPhotoUrl);
  const [bgDragOver, setBgDragOver] = useState(false);
  const [bgPhotoUrl, setBgPhotoUrl] = useState(author.bgPhotoUrl ?? "");
  const bgFileInputRef = useRef<HTMLInputElement>(null);

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

  function handleBgFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBgPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleBgFileDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setBgDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBgPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      if (bgFileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        bgFileInputRef.current.files = dataTransfer.files;
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    const file = fileInputRef.current?.files?.[0];
    const bgFile = bgFileInputRef.current?.files?.[0];

    let finalPhotoUrl = photoUrl;
    let finalBgPhotoUrl = bgPhotoUrl;

    if (file || bgFile) {
      setUploading(true);
      try {
        if (file) {
          finalPhotoUrl = await uploadToCloudinary(file, "voytart/authors");
          setPhotoUrl(finalPhotoUrl);
        }
        if (bgFile) {
          finalBgPhotoUrl = await uploadToCloudinary(bgFile, "voytart/authors");
          setBgPhotoUrl(finalBgPhotoUrl);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    }

    const actionData = new FormData(form);
    actionData.delete("image");
    actionData.delete("bgImage");
    actionData.set("photoUrl", finalPhotoUrl);
    actionData.set("bgPhotoUrl", finalBgPhotoUrl);

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

      <div className={styles.row}>
        {/* Фото автора */}
        <div className={styles.field}>
          <label className={styles.label}>Портрет автора</label>
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
              <span>Перетягни портрет або клікни для вибору</span>
            )}
          </div>
          <input ref={fileInputRef} type="file" name="image" accept="image/*" style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <input type="hidden" name="photoUrl" value={photoUrl} />
        </div>

        {/* Фонова картина */}
        <div className={styles.field}>
          <label className={styles.label}>Фонове зображення (Картина / Стіна)</label>
          <div
            className={`${styles.dropZone} ${bgDragOver ? styles.dragOver : ""}`}
            onDragOver={(e) => { e.preventDefault(); setBgDragOver(true); }}
            onDragLeave={() => setBgDragOver(false)}
            onDrop={handleBgFileDrop}
            onClick={() => bgFileInputRef.current?.click()}
          >
            {bgPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={bgPreview} alt="bg preview" className={styles.previewImg} />
            ) : (
              <span>Перетягни фон або клікни для вибору</span>
            )}
          </div>
          <input ref={bgFileInputRef} type="file" name="bgImage" accept="image/*" style={{ display: "none" }}
            onChange={handleBgFileChange}
          />
          <input type="hidden" name="bgPhotoUrl" value={bgPhotoUrl} />
        </div>
      </div>

      <div className={styles.row} style={{ alignItems: "center" }}>
        <div className={styles.field}>
          <label className={styles.label}>Порядок відображення (Order)</label>
          <input className={styles.input} type="number" name="order" defaultValue={author.order} min="0" required />
        </div>
        <div className={styles.field} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
          <input type="checkbox" name="active" defaultChecked={author.active} id="active" style={{ width: "20px", height: "20px", cursor: "pointer" }} />
          <label className={styles.label} htmlFor="active" style={{ marginBottom: 0, cursor: "pointer" }}>
            Активний (відображається в слайдері)
          </label>
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

      <button type="submit" className={styles.submitBtn} disabled={uploading || pending}>
        {uploading ? "Завантаження фото..." : pending ? "Збереження..." : "Зберегти зміни"}
      </button>
    </form>
  );
}
