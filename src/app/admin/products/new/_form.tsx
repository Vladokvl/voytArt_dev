"use client";
import { useActionState, useRef, useState, useTransition } from "react";
import { createProductAction } from "../_actions";
import styles from "../../_formStyles.module.scss";
import { uploadToCloudinary } from "~/lib/cloudinary-client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Author = { id: number; firstName: string; lastName: string };
type Category = { id: number; name: string };

export default function ProductForm({
  authors,
  categories,
}: {
  authors: Author[];
  categories: Category[];
}) {
  const [state, formAction] = useActionState(createProductAction, undefined);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => setDescription(editor.getHTML()),
  });

  async function handleDrop(e: React.DragEvent) {
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

    setUploading(true);
    let coverUrl = "";

    if (file) {
      try {
        coverUrl = await uploadToCloudinary(file, "voytart/products");
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
      <h1 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Новий товар</h1>
      {state?.error && <p className={styles.error}>{state.error}</p>}

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Назва *</label>
          <input className={styles.input} name="title" placeholder="Назва товару" required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Ціна (грн) *</label>
          <input className={styles.input} name="price" type="number" step="0.01" min="0" placeholder="0.00" required />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Залишок</label>
          <input className={styles.input} name="stock" type="number" min="0" defaultValue="0" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Порядок сортування</label>
          <input className={styles.input} name="sortOrder" type="number" defaultValue="0" />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.checkboxLabel}>
          <input name="isFeatured" type="checkbox" /> Рекомендований товар (Featured)
        </label>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Автор *</label>
          <select className={styles.select} name="authorId" required defaultValue="">
            <option value="" disabled>Оберіть автора</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Категорія *</label>
          <select className={styles.select} name="categoryId" required defaultValue="">
            <option value="" disabled>Оберіть категорію</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Опис</label>
        <div className={styles.editorWrapper}>
          <div className={styles.toolbar}>
            <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}
              className={editor?.isActive("bold") ? styles.toolbarBtnActive : styles.toolbarBtn}><b>B</b></button>
            <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={editor?.isActive("italic") ? styles.toolbarBtnActive : styles.toolbarBtn}><i>I</i></button>
            <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={editor?.isActive("bulletList") ? styles.toolbarBtnActive : styles.toolbarBtn}>≡</button>
          </div>
          <EditorContent editor={editor} className={styles.editorContent} />
        </div>
        <input type="hidden" name="description" value={description} />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Головне фото товару *</label>
        <div
          className={`${styles.dropZone} ${dragOver ? styles.dragOver : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" className={styles.preview} />
          ) : (
            <span>Перетягніть фото або клікніть для вибору</span>
          )}
        </div>
        <input ref={fileInputRef} type="file" name="image" accept="image/*" required style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
        />
      </div>

      <button type="submit" className={styles.submitBtn} disabled={uploading || pending}>
        {uploading ? "Завантаження фото..." : pending ? "Збереження..." : "Зберегти"}
      </button>
    </form>
  );
}
