"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { updatePostAction } from "../../_actions";
import styles from "@/app/admin/_formStyles.module.scss";
import { uploadToCloudinary } from "~/lib/cloudinary-client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useImageCrop } from "~/hooks/use-image-crop";
import ImageCropModal from "~/components/ui/ImageCropModal/ImageCropModal";
import { useSetBreadcrumb } from "@/app/admin/_components/BreadcrumbContext";
import { ArrowLeft, Save } from "lucide-react";

type Post = {
  id: number;
  title: string;
  content: string;
  coverUrl: string | null;
  date: Date | null;
};

export default function PostEditForm({ post }: { post: Post }) {
  useSetBreadcrumb(post.title);
  const [state, formAction] = useActionState(updatePostAction, undefined);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [content, setContent] = useState(post.content);
  const [preview, setPreview] = useState<string | null>(post.coverUrl);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: post.content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
  });

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

            <div className={styles.field}>
              <label className={styles.label}>Заголовок публікації *</label>
              <input
                className={styles.input}
                name="title"
                defaultValue={post.title}
                placeholder="Заголовок поста"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Контент *</label>
              <div className={styles.editorWrapper}>
                <div className={styles.toolbar}>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={editor?.isActive("bold") ? styles.toolbarBtnActive : styles.toolbarBtn}
                  >
                    <b>B</b>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={editor?.isActive("italic") ? styles.toolbarBtnActive : styles.toolbarBtn}
                  >
                    <i>I</i>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={editor?.isActive("bulletList") ? styles.toolbarBtnActive : styles.toolbarBtn}
                  >
                    ≡ Список
                  </button>
                </div>
                <EditorContent editor={editor} className={styles.editorContent} />
              </div>
              <input type="hidden" name="content" value={content} />
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
