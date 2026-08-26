"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { updatePostAction } from "../../_actions";
import styles from "@/app/admin/_formStyles.module.scss";
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
import { useSetBreadcrumb } from "@/app/admin/_components/BreadcrumbContext";
import { ArrowLeft, Save } from "lucide-react";
import LanguageTabs from "@/app/admin/_components/LanguageTabs";

type Post = {
  id: number;
  title: string;
  titleUk?: string | null;
  content: string;
  contentUk?: string | null;
  coverUrl: string | null;
  date: Date | null;
};

export default function PostEditForm({ post }: { post: Post }) {
  useSetBreadcrumb(post.title);
  const [state, formAction] = useActionState(updatePostAction, undefined);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [langTab, setLangTab] = useState<"en" | "uk">("en");
  const [content, setContent] = useState(post.content);
  const [contentUk, setContentUk] = useState(post.contentUk ?? "");
  const [preview, setPreview] = useState<string | null>(post.coverUrl);
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
    let coverUrl = post.coverUrl ?? "";

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
      {/* ── Sticky Top Bar ─────────────────────────────────── */}
      <div className={styles.formHeaderSticky}>
        <div className={styles.headerTitleWrap}>
          <Link href="/admin/posts" className={styles.cancelBtn} style={{ padding: "0.5rem 0.75rem" }}>
            <ArrowLeft size={16} />
            <span>До списку</span>
          </Link>
          <div>
            <h1 className={styles.headerTitle}>Редагування поста: {post.title}</h1>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
              ID: #{post.id}
            </p>
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={uploading || pending}
        >
          <Save size={16} />
          <span>{uploading ? "Завантаження фото..." : pending ? "Збереження..." : "Зберегти"}</span>
        </button>
      </div>

      {state?.error && <p className={styles.error}>{state.error}</p>}
      <input type="hidden" name="id" value={post.id} />

      {/* ── 2-Column Grid Layout ───────────────────────────── */}
      <div className={styles.formGrid}>
        {/* Main Column */}
        <div className={styles.mainColumn}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Основний вміст</h3>
              <span className={styles.cardDesc}>Текст та заголовок публікації</span>
            </div>

            <LanguageTabs activeTab={langTab} onChange={setLangTab} />

            <div style={{ display: langTab === "en" ? "block" : "none" }}>
              <div className={styles.field}>
                <label className={styles.label}>Title (EN) *</label>
                <input
                  className={styles.input}
                  name="title"
                  defaultValue={post.title}
                  placeholder="Post title in English"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Content (EN) *</label>
                <TipTapEditor
                  content={content}
                  onChange={(html) => setContent(html)}
                />
                <input type="hidden" name="content" value={content} />
              </div>
            </div>

            <div style={{ display: langTab === "uk" ? "block" : "none" }}>
              <div className={styles.field}>
                <label className={styles.label}>Заголовок (Українська)</label>
                <input
                  className={styles.input}
                  name="titleUk"
                  defaultValue={post.titleUk ?? ""}
                  placeholder="Заголовок українською"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Контент (Українська)</label>
                <TipTapEditor
                  content={contentUk}
                  onChange={(html) => setContentUk(html)}
                />
                <input type="hidden" name="contentUk" value={contentUk} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className={styles.sidebarColumn}>
          {/* Metadata Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Дата публікації</h3>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Дата</label>
              <input
                className={styles.input}
                name="date"
                type="date"
                defaultValue={post.date ? post.date.toISOString().split("T")[0] : ""}
              />
            </div>
          </div>

          {/* Cover Photo Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Головна обкладинка</h3>
            </div>
            <div className={styles.field}>
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
                  <div className={styles.previewWrap}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="preview" className={styles.previewImg} />
                  </div>
                ) : (
                  <span>Перетягни обкладинку або клікни для вибору</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <input type="hidden" name="coverUrl" />
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

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
        <Link href="/admin/posts" className={styles.cancelBtn}>
          Скасувати
        </Link>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={uploading || pending}
        >
          <Save size={16} />
          <span>{uploading ? "Завантаження фото..." : pending ? "Збереження..." : "Зберегти зміни"}</span>
        </button>
      </div>
    </form>
  );
}
