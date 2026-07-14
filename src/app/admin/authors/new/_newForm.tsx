"use client";
import { useActionState, useRef, useState, useTransition } from "react";
import { createAuthorAction } from "../_actions";
import styles from "../../_formStyles.module.scss";
import artStyles from "@/app/art/[[...artistId]]/art.module.scss";
import { uploadToCloudinary } from "~/lib/cloudinary-client";
import { useImageCrop } from "~/hooks/use-image-crop";
import ImageCropModal from "~/components/ui/ImageCropModal/ImageCropModal";

export default function AuthorForm() {
  const [state, formAction] = useActionState(createAuthorAction, undefined);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  // Поля форми в локальному стані для живого прев'ю
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [shortDesc, setShortDesc] = useState("");

  // Режими ховеру прев'ю
  const [previewHover, setPreviewHover] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const isHovered = cardHovered || previewHover;

  // Портрет (з кропом)
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Фон (з кропом)
  const [bgPreview, setBgPreview] = useState<string | null>(null);
  const [bgDragOver, setBgDragOver] = useState(false);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  // 1. Кроп портрета
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

  // 2. Кроп фону
  const {
    cropFile: bgCropFile,
    handleFileChange: handleBgFileChange,
    handleFileDrop: handleBgFileDrop,
    onCropSave: onBgCropSave,
    onCropCancel: onBgCropCancel,
  } = useImageCrop({
    fileInputRef: bgFileInputRef,
    setPreview: setBgPreview,
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    const file = fileInputRef.current?.files?.[0];
    const bgFile = bgFileInputRef.current?.files?.[0];

    setUploading(true);
    let photoUrl = "";
    let bgPhotoUrl = "";

    try {
      if (file) {
        photoUrl = await uploadToCloudinary(file, "voytart/authors");
      }
      if (bgFile) {
        bgPhotoUrl = await uploadToCloudinary(bgFile, "voytart/authors");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }

    const actionData = new FormData(form);
    actionData.delete("image");
    actionData.delete("bgImage");
    actionData.set("photoUrl", photoUrl);
    actionData.set("bgPhotoUrl", bgPhotoUrl);

    startTransition(() => formAction(actionData));
  }

  return (
    <div style={{ display: "flex", width: "100%", position: "relative" }}>
      {/* Підключення динамічних стилів для адаптивної верстки панелі */}
      <style dangerouslySetInnerHTML={{ __html: `
        .formColumn {
          flex: 1 1 500px;
          max-width: calc(100% - 33.333vw - 2.5rem);
          padding-right: 1.5rem;
          transition: max-width 0.3s ease;
        }
        .previewPanel {
          position: fixed;
          right: 0;
          top: 0;
          bottom: 0;
          width: 33.333vw;
          height: 100vh;
          z-index: 999;
          border-left: 2px solid rgba(255, 255, 255, 0.15);
          box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
          background: #111;
          overflow: hidden;
        }
        @media (max-width: 999px) {
          .previewPanel {
            position: relative !important;
            width: 100% !important;
            height: 100vh !important;
            border-left: none !important;
            border-top: 2px solid rgba(255, 255, 255, 0.15);
            box-shadow: none !important;
          }
          .formColumn {
            max-width: 100% !important;
            padding-right: 0 !important;
          }
        }
      ` }} />

      {/* Основна форма */}
      <form onSubmit={handleSubmit} className={`${styles.form} formColumn`} style={{ margin: 0 }}>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>Новий автор</h1>
        {state?.error && <p className={styles.error}>{state.error}</p>}

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Імʼя *</label>
            <input
              className={styles.input}
              name="firstName"
              placeholder="Імʼя"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Прізвище *</label>
            <input
              className={styles.input}
              name="lastName"
              placeholder="Прізвище"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Короткий опис (для відображення в слайдері)</label>
          <input
            className={styles.input}
            name="shortDesc"
            placeholder="Короткий опис автора в слайдері"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Біографія (для сторінки робіт)</label>
          <textarea className={styles.textarea} name="bio" placeholder="Повна біографія автора" />
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
                <span>Перетягни портрет або клікни</span>
              )}
            </div>
            <input ref={fileInputRef} type="file" name="image" accept="image/*" style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          {/* Фонова картина */}
          <div className={styles.field}>
            <label className={styles.label}>Фонове зображення</label>
            <div
              className={`${styles.dropZone} ${bgDragOver ? styles.dragOver : ""}`}
              onDragOver={(e) => { e.preventDefault(); setBgDragOver(true); }}
              onDragLeave={() => setBgDragOver(false)}
              onDrop={(e) => {
                setBgDragOver(false);
                handleBgFileDrop(e);
              }}
              onClick={() => bgFileInputRef.current?.click()}
            >
              {bgPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={bgPreview} alt="bg preview" className={styles.previewImg} />
              ) : (
                <span>Перетягни фон або клікни</span>
              )}
            </div>
            <input ref={bgFileInputRef} type="file" name="bgImage" accept="image/*" style={{ display: "none" }}
              onChange={handleBgFileChange}
            />
          </div>
        </div>

        <div className={styles.row} style={{ alignItems: "center" }}>
          <div className={styles.field} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
            <input type="checkbox" name="active" defaultChecked id="active" style={{ width: "20px", height: "20px", cursor: "pointer" }} />
            <label className={styles.label} htmlFor="active" style={{ marginBottom: 0, cursor: "pointer" }}>
              Активний (відображається в слайдері)
            </label>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={uploading || pending} style={{ marginTop: "2rem" }}>
          {uploading ? "Завантаження фото..." : pending ? "Збереження..." : "Зберегти"}
        </button>
      </form>

      {/* Права колонка: Інтерактивне прев'ю картки 1-в-1 з Арт сторінкою */}
      <div className="previewPanel">
        {/* Кнопка фіксації ховеру поверх прев'ю */}
        <button
          type="button"
          onClick={() => setPreviewHover(!previewHover)}
          style={{
            position: "absolute",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1000,
            padding: "0.5rem 1rem",
            background: previewHover ? "#d7ff01" : "rgba(0,0,0,0.6)",
            color: previewHover ? "#000" : "#fff",
            border: "1px solid rgba(255,255,255,0.25)",
            borderRadius: "20px",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
            transition: "all 0.3s ease",
            backdropFilter: "blur(5px)"
          }}
        >
          {previewHover ? "Зафіксовано: Ховер" : "Режим: Звичайний"}
        </button>

        {/* Секція картки автогенерації з оригінальними стилями */}
        <div
          className={artStyles.column}
          onMouseEnter={() => setCardHovered(true)}
          onMouseLeave={() => setCardHovered(false)}
          style={{ width: "100%", height: "100%" }}
        >
          {/* Фонове зображення карти */}
          <div
            className={artStyles.colBg}
            style={{
              backgroundImage: bgPreview ? `url(${bgPreview})` : "url(/artPageAssets/IvankaBackground.jpg)",
            }}
          />

          {/* Затемнюючий оверлей */}
          <div
            className={`${artStyles.colOverlay} ${
              isHovered ? artStyles.colOverlayVisible : ""
            }`}
          />

          {/* Контейнер імені та короткого опису */}
          <div className={artStyles.infoWrap}>
            {/* Ім'я автора */}
            <h2 className={artStyles.colName}>{firstName || "ІМʼЯ"}</h2>

            {/* Короткий опис */}
            <div
              className={`${artStyles.colText} ${
                isHovered ? artStyles.colTextVisible : ""
              }`}
            >
              <p className={artStyles.colDesc}>
                {shortDesc || "Короткий опис автора з'явиться тут при наведенні."}
              </p>
            </div>
          </div>

          {/* Контейнер рамки портрета */}
          <div
            className={`${artStyles.portraitWrap} ${
              isHovered ? artStyles.portraitWrapDown : ""
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview || "/artPageAssets/Ivanka.png"}
              alt="portrait preview"
              className={artStyles.portraitImg}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          </div>
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

      {bgCropFile && (
        <ImageCropModal
          open={!!bgCropFile}
          imageFile={bgCropFile}
          onCropSave={onBgCropSave}
          onCancel={onBgCropCancel}
        />
      )}
    </div>
  );
}
