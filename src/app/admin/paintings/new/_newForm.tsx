"use client";
import { useActionState, useRef, useState, useTransition } from "react";
import { createPaintingAction } from "./_actions";
import { type Author } from "@/types/Author";
import styles from "../paintings.module.scss";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

export default function PaintingForm({ authors, collections }: { authors: Author[]; collections: { id: number; title: string; authorId: number }[] }) {
  const [state, formAction] = useActionState(createPaintingAction, undefined);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [description, setDescription] = useState("");
  const [selectedAuthorId, setSelectedAuthorId] = useState("");
  const [selectedCollectionId, setSelectedCollectionId] = useState("");

  const filteredCollections = selectedAuthorId
    ? collections.filter((c) => String(c.authorId) === selectedAuthorId)
    : collections;

  function handleAuthorChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newAuthorId = e.target.value;
    setSelectedAuthorId(newAuthorId);
    // скидаємо колекцію якщо вона не належить новому автору
    if (selectedCollectionId) {
      const col = collections.find((c) => String(c.id) === selectedCollectionId);
      if (col && String(col.authorId) !== newAuthorId) {
        setSelectedCollectionId("");
      }
    }
  }

  function handleCollectionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newCollectionId = e.target.value;
    setSelectedCollectionId(newCollectionId);
    // автоматично виставляємо автора з колекції
    if (newCollectionId) {
      const col = collections.find((c) => String(c.id) === newCollectionId);
      if (col) setSelectedAuthorId(String(col.authorId));
    }
  }

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => setDescription(editor.getHTML()),
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem("image") as HTMLInputElement;
    const file = fileInput.files?.[0];

    setUploading(true);
    let imageUrl = "";

    if (file) {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "voytart_unsigned");
      data.append("folder", "voytart/paintings");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data },
      );
      const json = (await res.json()) as { secure_url: string };
      imageUrl = json.secure_url;
    }

    setUploading(false);

    const actionData = new FormData(form);
    actionData.delete("image");
    actionData.set("coverUrl", imageUrl);

    startTransition(() => {
      formAction(actionData);
    });
  }

  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    // Підставити файл у hidden input
    const dt = new DataTransfer();
    dt.items.add(file);
    if (fileInputRef.current) fileInputRef.current.files = dt.files;
    setPreview(URL.createObjectURL(file));
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {state?.error && <p className={styles.error}>{state.error}</p>}

      <div className={styles.field}>
        <label className={styles.label}>Назва *</label>
        <input
          className={styles.input}
          name="title"
          placeholder="Назва"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Опис</label>
        <div className={styles.field}>
          <div className={styles.editorWrapper}>
            <div className={styles.toolbar}>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={
                  editor?.isActive("bold")
                    ? styles.toolbarBtnActive
                    : styles.toolbarBtn
                }
              >
                <b>B</b>
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={
                  editor?.isActive("italic")
                    ? styles.toolbarBtnActive
                    : styles.toolbarBtn
                }
              >
                <i>I</i>
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={
                  editor?.isActive("bulletList")
                    ? styles.toolbarBtnActive
                    : styles.toolbarBtn
                }
              >
                ≡
              </button>
            </div>
            <EditorContent editor={editor} className={styles.editorContent} />
          </div>
          <input type="hidden" name="description" value={description} />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Автор *</label>
        <select
          className={styles.select}
          name="authorId"
          required
          value={selectedAuthorId}
          onChange={handleAuthorChange}
        >
          <option value="">Оберіть автора</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.firstName} {a.lastName}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Колекція</label>
        <select
          className={styles.select}
          name="collectionId"
          value={selectedCollectionId}
          onChange={handleCollectionChange}
        >
          <option value="">Без колекції</option>
          {filteredCollections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Рік</label>
          <input
            className={styles.input}
            name="year"
            type="number"
            placeholder="2024"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.checkboxLabel}>
          <input name="hasNeon" type="checkbox" /> Є неонова версія
        </label>
        <label className={styles.checkboxLabel}>
          <input name="isForSale" type="checkbox" /> Продається
        </label>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Фото *</label>
        <div
          className={`${styles.dropZone} ${dragOver ? styles.dragOver : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
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
          <input
            ref={fileInputRef}
            name="image"
            type="file"
            accept="image/*"
            required
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreview(URL.createObjectURL(file));
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        className={styles.button}
        disabled={pending || uploading}
      >
        {uploading
          ? "Завантаження фото..."
          : pending
            ? "Збереження..."
            : "Зберегти"}
      </button>
    </form>
  );
}
