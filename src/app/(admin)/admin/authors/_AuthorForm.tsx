"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createAuthorAction, updateAuthorAction } from "./_actions";
import styles from "../_formStyles.module.scss";
import artStyles from "~/app/(site)/[locale]/art/[[...artistId]]/art.module.scss";
import LanguageTabs from "../_components/LanguageTabs";
import ImageUploadField from "../_components/ImageUploadField";
import { useUnsavedUploads } from "../_components/UnsavedUploadContext";

export type Author = {
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

interface AuthorFormProps {
  author?: Author;
}

export default function AuthorForm({ author }: AuthorFormProps) {
  const isEdit = Boolean(author);

  // Form action: update if editing, create if new
  const actionToUse = isEdit ? updateAuthorAction : createAuthorAction;
  const [state, formAction] = useActionState(actionToUse, undefined);

  const [pending, startTransition] = useTransition();
  const [isPortraitUploading, setIsPortraitUploading] = useState(false);
  const [isBgUploading, setIsBgUploading] = useState(false);

  const [langTab, setLangTab] = useState<"en" | "uk">("en");

  // Form fields in local state for live preview on the right
  const [firstName, setFirstName] = useState(author?.firstName ?? "");
  const [lastName, setLastName] = useState(author?.lastName ?? "");
  const [shortDesc, setShortDesc] = useState(author?.shortDesc ?? "");

  const [firstNameUk, setFirstNameUk] = useState(author?.firstNameUk ?? "");
  const [lastNameUk, setLastNameUk] = useState(author?.lastNameUk ?? "");
  const [shortDescUk, setShortDescUk] = useState(author?.shortDescUk ?? "");
  const [bioUk, setBioUk] = useState(author?.bioUk ?? "");

  // Live preview mode states
  const [previewHover, setPreviewHover] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const isHovered = cardHovered || previewHover;

  const [preview, setPreview] = useState<string | null>(author?.photoUrl ?? null);
  const [bgPreview, setBgPreview] = useState<string | null>(author?.bgPhotoUrl ?? null);

  const isSavingOrUploading = pending || isPortraitUploading || isBgUploading;
  const { commitStagedUrls } = useUnsavedUploads();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    commitStagedUrls();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <div style={{ display: "flex", width: "100%", position: "relative" }}>
      {/* Styles for right preview panel layout */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
      `,
        }}
      />

      {/* Main form */}
      <form onSubmit={handleSubmit} className={`${styles.form} formColumn`} style={{ margin: 0 }}>
        {/* Sticky Top Bar */}
        <div className={styles.formHeaderSticky}>
          <div className={styles.headerTitleWrap}>
            <Link href="/admin/authors" className={styles.cancelBtn} style={{ padding: "0.5rem 0.75rem" }}>
              <ArrowLeft size={16} />
              <span>До списку</span>
            </Link>
            <div>
              <h1 className={styles.headerTitle}>
                {author
                  ? `Редагування автора: ${author.firstName} ${author.lastName}`
                  : "Створення нового автора"}
              </h1>
              {author && (
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
                  ID: #{author.id}
                </p>
              )}
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isSavingOrUploading}>
            <Save size={16} />
            <span>
              {isPortraitUploading || isBgUploading
                ? "Завантаження фото..."
                : pending
                  ? "Збереження..."
                  : isEdit
                    ? "Зберегти"
                    : "Створити"}
            </span>
          </button>
        </div>

        {state?.error && <p className={styles.error}>{state.error}</p>}

        {author && (
          <>
            <input type="hidden" name="id" value={author.id} />
            <input type="hidden" name="order" value={author.order} />
          </>
        )}

        {/* Card 1: Name, bio, active state */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Основні дані художника</h3>
            <span className={styles.cardDesc}>Імʼя, прізвище та біографія</span>
          </div>

          <LanguageTabs activeTab={langTab} onChange={setLangTab} />

          <div style={{ display: langTab === "en" ? "block" : "none" }}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>First Name (EN) *</label>
                <input
                  className={styles.input}
                  name="firstName"
                  placeholder="First Name in English"
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
                  placeholder="Last Name in English"
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
                defaultValue={author?.bio ?? ""}
                placeholder="Full artist biography in English"
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
              defaultChecked={author?.active ?? true}
              id="active"
            />
          </div>
        </div>

        {/* Card 2: Photos with reusable ImageUploadField */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Медіа та портрет</h3>
            <span className={styles.cardDesc}>Зображення для картки в слайдері</span>
          </div>

          <div className={styles.row}>
            {/* Portrait Image */}
            <div className={styles.field}>
              <ImageUploadField
                name="photoUrl"
                label="Портрет автора"
                folder="voytart/authors"
                initialUrl={author?.photoUrl}
                aspectRatio={3 / 4}
                helpText="Основне фото автора (пропорція 3:4)"
                onChange={(url) => setPreview(url || null)}
                onUploadingChange={setIsPortraitUploading}
              />
            </div>

            {/* Background Image */}
            <div className={styles.field}>
              <ImageUploadField
                name="bgPhotoUrl"
                label="Фонове фото"
                folder="voytart/authors"
                initialUrl={author?.bgPhotoUrl}
                aspectRatio={9 / 16}
                helpText="Показується при наведенні (пропорція 9:16)"
                onChange={(url) => setBgPreview(url || null)}
                onUploadingChange={setIsBgUploading}
              />
            </div>
          </div>
        </div>
      </form>

      {/* Right Column: Live Interactive ArtHero Card Preview */}
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
            backdropFilter: "blur(5px)",
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
              backgroundImage: bgPreview
                ? `url(${bgPreview})`
                : preview
                  ? `url(${preview})`
                  : "url(/artPageAssets/IvankaBackground.jpg)",
            }}
          />

          <div
            className={`${artStyles.colOverlay} ${isHovered ? artStyles.colOverlayVisible : ""}`}
          />

          <div className={artStyles.infoWrap}>
            <h2 className={artStyles.colName}>{firstName || "ІМʼЯ"}</h2>
            <div
              className={`${artStyles.colText} ${isHovered ? artStyles.colTextVisible : ""}`}
            >
              <p className={artStyles.colDesc}>
                {shortDesc || "Короткий опис автора з'явиться тут при наведенні."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
