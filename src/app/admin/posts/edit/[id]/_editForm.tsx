"use client";
import { useActionState, useRef, useState, useTransition } from "react";
import { updatePostAction } from "../../_actions";
import styles from "@/app/admin/_formStyles.module.scss";
import { uploadToCloudinary } from "~/lib/cloudinary-client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useImageCrop } from "~/hooks/use-image-crop";
import ImageCropModal from "~/components/ui/ImageCropModal/ImageCropModal";
import { useSetBreadcrumb } from "@/app/admin/_components/BreadcrumbContext";

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
      <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Редагувати пост</h1>
      {state?.error && <p className={styles.error}>{state.error}</p>}
      <input type="hidden" name="id" value={post.id} />

      <div className={styles.field}>
        <label className={styles.label}>Заголовок *</label>
        <input className={styles.input} name="title" defaultValue={post.title} required />
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

      <div className={styles.field}>
        <label className={styles.label}>Контент *</label>
        <div className={styles.editorWrapper}>
          <div className={styles.toolbar}>
            <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}
              className={editor?.isActive("bold") ? styles.toolbarBtnActive : styles.toolbarBtn}>
              <b>B</b>
            </button>
            <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={editor?.isActive("italic") ? styles.toolbarBtnActive : styles.toolbarBtn}>
              <i>I</i>
            </button>
            <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={editor?.isActive("bulletList") ? styles.toolbarBtnActive : styles.toolbarBtn}>
              ≡
            </button>
          </div>
          <EditorContent editor={editor} className={styles.editorContent} />
        </div>
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
        {uploading ? "Завантаження фото..." : pending ? "Збереження..." : "Зберегти зміни"}
      </button>
    </form>
  );
}
