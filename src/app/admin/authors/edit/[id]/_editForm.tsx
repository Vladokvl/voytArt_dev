"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { updateAuthorAction } from "../../_actions";
import styles from "@/app/admin/_formStyles.module.scss";
import artStyles from "@/app/art/[[...artistId]]/art.module.scss";
import { uploadToCloudinary } from "~/lib/cloudinary-client";
import { useImageCrop } from "~/hooks/use-image-crop";
import ImageCropModal from "~/components/ui/ImageCropModal/ImageCropModal";
import { useSetBreadcrumb } from "@/app/admin/_components/BreadcrumbContext";
import { ArrowLeft, Save } from "lucide-react";
import LanguageTabs from "@/app/admin/_components/LanguageTabs";

type Author = {
  id: number;
  firstName: string;
  lastName: string;
  firstNameUk?: string | null;
  lastNameUk?: string | null;
  bio: string | null;
  bioUk?: string | null;
  shortDesc: string | null;
  shortDescUk?: string | null;
  photoUrl: string | null;
  bgPhotoUrl: string | null;
  order: number;
  active: boolean;
};

export default function AuthorEditForm({ author }: { author: Author }) {
  const [state, formAction] = useActionState(updateAuthorAction, undefined);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  const [langTab, setLangTab] = useState<"en" | "uk">("en");

  // Поля форми в локальному стані для живого прев'ю
  const [firstName, setFirstName] = useState(author.firstName);
  const [lastName, setLastName] = useState(author.lastName);
  const [shortDesc, setShortDesc] = useState(author.shortDesc ?? "");

  const [firstNameUk, setFirstNameUk] = useState(author.firstNameUk ?? "");
  const [lastNameUk, setLastNameUk] = useState(author.lastNameUk ?? "");
  const [shortDescUk, setShortDescUk] = useState(author.shortDescUk ?? "");
  const [bioUk, setBioUk] = useState(author.bioUk ?? "");

  useSetBreadcrumb(`${firstName} ${lastName}`.trim() || `${author.firstName} ${author.lastName}`);

  // Режими ховеру прев'ю
  const [previewHover, setPreviewHover] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const isHovered = cardHovered || previewHover;

  // Портрет (з кропом)
  const [preview, setPreview] = useState<string | null>(author.photoUrl);
  const [dragOver, setDragOver] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(author.photoUrl ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Фон (з кропом)
  const [bgPreview, setBgPreview] = useState<string | null>(author.bgPhotoUrl);
  const [bgDragOver, setBgDragOver] = useState(false);
  const [bgPhotoUrl, setBgPhotoUrl] = useState(author.bgPhotoUrl ?? "");
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
    <div style={{ display: "flex", width: "100%", position: "relative" }}>
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
        {/* ── Sticky Top Bar ─────────────────────────────────── */}
        <div className={styles.formHeaderSticky}>
          <div className={styles.headerTitleWrap}>
            <Link href="/admin/authors" className={styles.cancelBtn} style={{ padding: "0.5rem 0.75rem" }}>
              <ArrowLeft size={16} />
              <span>До списку</span>
            </Link>
            <div>
              <h1 className={styles.headerTitle}>Редагування автора: {author.firstName} {author.lastName}</h1>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
                ID: #{author.id}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={uploading || pending}
          >
            <Save size={16} />
            <span>{uploading ? "Завантаження..." : pending ? "Збереження..." : "Зберегти"}</span>
          </button>
        </div>

        {state?.error && <p className={styles.error}>{state.error}</p>}
        <input type="hidden" name="id" value={author.id} />
        <input type="hidden" name="order" value={author.order} />

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Основні дані художника</h3>
            <span className={styles.cardDesc}>Імʼя, прізвище та статус</span>
          </div>

          <LanguageTabs activeTab={langTab} onChange={setLangTab} />

          <div style={{ display: langTab === "en" ? "block" : "none" }}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>First Name (EN) *</label>
                <input
                  className={styles.input}
                  name="firstName"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Last Name (EN) *</label>
                <input
                  className={styles.input}
                  name="lastName"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Short Description (EN)</label>
              <input
                className={styles.input}
                name="shortDesc"
                placeholder="Short description for slider in English"
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Biography (EN)</label>
              <textarea
                className={styles.textarea}
                name="bio"
                defaultValue={author.bio ?? ""}
                rows={4}
              />
            </div>
          </div>

          <div style={{ display: langTab === "uk" ? "block" : "none" }}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Імʼя (Українська)</label>
                <input
                  className={styles.input}
                  name="firstNameUk"
                  placeholder="Імʼя українською"
                  value={firstNameUk}
                  onChange={(e) => setFirstNameUk(e.target.value)}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Прізвище (Українська)</label>
                <input
                  className={styles.input}
                  name="lastNameUk"
                  placeholder="Прізвище українською"
                  value={lastNameUk}
                  onChange={(e) => setLastNameUk(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Короткий опис (Українська)</label>
              <input
                className={styles.input}
                name="shortDescUk"
                placeholder="Короткий опис автора українською"
                value={shortDescUk}
                onChange={(e) => setShortDescUk(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Біографія (Українська)</label>
              <textarea
                className={styles.textarea}
                name="bioUk"
                placeholder="Повна біографія автора українською"
                value={bioUk}
                onChange={(e) => setBioUk(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <div className={styles.checkboxField}>
            <div>
              <span style={{ fontWeight: 600, display: "block" }}>Активний автор</span>
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                Відображається в головному слайдері та списку авторів
              </span>
            </div>
            <input
              type="checkbox"
              name="active"
              defaultChecked={author.active}
              id="active"
            />
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Медіа та портрет</h3>
            <span className={styles.cardDesc}>Зображення для картки в слайдері</span>
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
                  <div className={styles.previewWrap}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="preview" className={styles.previewImg} />
                  </div>
                ) : (
                  <span>Перетягни портрет або клікни</span>
                )}
              </div>
              <input ref={fileInputRef} type="file" name="image" accept="image/*" style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <input type="hidden" name="photoUrl" value={photoUrl} />
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
                  <div className={styles.previewWrap}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={bgPreview} alt="bg preview" className={styles.previewImg} />
                  </div>
                ) : (
                  <span>Перетягни фон або клікни</span>
                )}
              </div>
              <input ref={bgFileInputRef} type="file" name="bgImage" accept="image/*" style={{ display: "none" }}
                onChange={handleBgFileChange}
              />
              <input type="hidden" name="bgPhotoUrl" value={bgPhotoUrl} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem", marginBottom: "2rem" }}>
          <Link href="/admin/authors" className={styles.cancelBtn}>
            Скасувати
          </Link>
          <button type="submit" className={styles.submitBtn} disabled={uploading || pending}>
            <Save size={16} />
            <span>{uploading ? "Завантаження фото..." : pending ? "Збереження..." : "Зберегти зміни"}</span>
          </button>
        </div>
      </form>

      {/* Права колонка: Інтерактивне прев'ю картки 1-в-1 з Арт сторінкою */}
      <div className="previewPanel">
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

        <div
          className={artStyles.column}
          onMouseEnter={() => setCardHovered(true)}
          onMouseLeave={() => setCardHovered(false)}
          style={{ width: "100%", height: "100%" }}
        >
          <div
            className={artStyles.colBg}
            style={{
              backgroundImage: bgPreview ? `url(${bgPreview})` : "url(/artPageAssets/IvankaBackground.jpg)",
            }}
          />

          <div
            className={`${artStyles.colOverlay} ${
              isHovered ? artStyles.colOverlayVisible : ""
            }`}
          />

          <div className={artStyles.infoWrap}>
            <h2 className={artStyles.colName}>{firstName || "ІМʼЯ"}</h2>
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
