"use client";

import { useActionState, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { createPostAction, updatePostAction } from "./_actions";
import styles from "../_formStyles.module.scss";
import LanguageTabs from "../_components/LanguageTabs";
import ImageUploadField from "../_components/ImageUploadField";
import { useUnsavedUploads } from "../_components/UnsavedUploadContext";
import { useSetBreadcrumb } from "@/app/(admin)/admin/_components/BreadcrumbContext";

const TipTapEditor = dynamic(() => import("~/components/admin/TipTapEditor"), {
  ssr: false,
  loading: () => (
    <div
      style={{ minHeight: "200px", background: "#f1f5f9", borderRadius: "8px" }}
    />
  ),
});

export type PostItem = {
  id: number;
  title: string;
  titleUk?: string | null;
  content: string;
  contentUk?: string | null;
  coverUrl: string | null;
  date: Date | null;
};

interface PostFormProps {
  post?: PostItem;
}

export default function PostForm({ post }: PostFormProps) {
  const isEdit = Boolean(post);
  useSetBreadcrumb(post?.title ?? "Новий пост");

  const actionToUse = isEdit ? updatePostAction : createPostAction;
  const [state, formAction] = useActionState(actionToUse, undefined);

  const [pending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const [langTab, setLangTab] = useState<"en" | "uk">("en");

  const [content, setContent] = useState(post?.content ?? "");
  const [contentUk, setContentUk] = useState(post?.contentUk ?? "");

  const { commitStagedUrls } = useUnsavedUploads();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    commitStagedUrls();
    const formData = new FormData(e.currentTarget);
    formData.set("content", content);
    formData.set("contentUk", contentUk);

    startTransition(() => {
      formAction(formData);
    });
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
            <h1 className={styles.headerTitle}>
              {post ? `Редагування поста: ${post.title}` : "Створення нового поста"}
            </h1>
            {post && (
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
                ID: #{post.id}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={pending || isUploading}
        >
          <Save size={16} />
          <span>
            {isUploading
              ? "Завантаження фото..."
              : pending
                ? "Збереження..."
                : post
                  ? "Зберегти"
                  : "Опублікувати"}
          </span>
        </button>
      </div>

      {state?.error && <p className={styles.error}>{state.error}</p>}
      {post && <input type="hidden" name="id" value={post.id} />}

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
                  defaultValue={post?.title ?? ""}
                  placeholder="Post title in English"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Content (EN) *</label>
                <TipTapEditor
                  content={content}
                  onChange={setContent}
                />
              </div>
            </div>

            <div style={{ display: langTab === "uk" ? "block" : "none" }}>
              <div className={styles.field}>
                <label className={styles.label}>Заголовок (Українська)</label>
                <input
                  className={styles.input}
                  name="titleUk"
                  defaultValue={post?.titleUk ?? ""}
                  placeholder="Заголовок публікації українською"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Вміст (Українська)</label>
                <TipTapEditor
                  content={contentUk}
                  onChange={setContentUk}
                />
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
                defaultValue={post?.date ? new Date(post.date).toISOString().split("T")[0] : ""}
              />
            </div>
          </div>

          {/* Cover Photo Card with ImageUploadField */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Головна обкладинка</h3>
            </div>

            <ImageUploadField
              name="coverUrl"
              label="Обкладинка поста"
              folder="voytart/posts"
              initialUrl={post?.coverUrl}
              aspectRatio={16 / 9}
              helpText="Рекомендовано 16:9, відображається у стрічці блогу"
              onUploadingChange={setIsUploading}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
