"use client";
import { useActionState, useState, useTransition } from "react";
import { updatePaintingAction } from "./_actions";
import { type Author } from "@/types/Author";
import styles from "../paintings.module.scss";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "next/image";
import MediaSection from "./_MediaSection";

type PaintingMedia = { id: number; url: string; isNeon: boolean; order: number };

type PaintingForEdit = {
  id: number;
  title: string;
  description: string | null;
  coverUrl: string;
  year: number | null;
  hasNeon: boolean;
  isForSale: boolean;
  authorId: number;
  collectionId: number | null;
  media: PaintingMedia[];
};

export default function PaintingEditForm({
  painting,
  authors,
  collections,
}: {
  painting: PaintingForEdit;
  authors: Author[];
  collections: { id: number; title: string; authorId: number }[];
}) {
  const [state, formAction] = useActionState(updatePaintingAction, undefined);
  const [pending, startTransition] = useTransition();
  const [description, setDescription] = useState(painting.description ?? "");
  const [selectedAuthorId, setSelectedAuthorId] = useState(String(painting.authorId));
  const [selectedCollectionId, setSelectedCollectionId] = useState(
    painting.collectionId ? String(painting.collectionId) : ""
  );

  const filteredCollections = selectedAuthorId
    ? collections.filter((c) => String(c.authorId) === selectedAuthorId)
    : collections;

  function handleAuthorChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newAuthorId = e.target.value;
    setSelectedAuthorId(newAuthorId);
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
    if (newCollectionId) {
      const col = collections.find((c) => String(c.id) === newCollectionId);
      if (col) setSelectedAuthorId(String(col.authorId));
    }
  }

  const editor = useEditor({
    extensions: [StarterKit],
    content: painting.description ?? "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => setDescription(editor.getHTML()),
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const actionData = new FormData(e.currentTarget);
    startTransition(() => formAction(actionData));
  }

  return (
    <div className={styles.editLayout}>
      <form onSubmit={handleSubmit} className={styles.form}>
        {state?.error && <p className={styles.error}>{state.error}</p>}
        <input type="hidden" name="id" value={String(painting.id)} />
        <input type="hidden" name="coverUrl" value={painting.coverUrl} />

        <div className={styles.field}>
          <label className={styles.label}>Назва *</label>
          <input
            className={styles.input}
            name="title"
            placeholder="Назва"
            defaultValue={painting.title}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Опис</label>
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
                ≡
              </button>
            </div>
            <EditorContent editor={editor} className={styles.editorContent} />
          </div>
          <input type="hidden" name="description" value={description} />
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
              defaultValue={painting.year ?? ""}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.checkboxLabel}>
            <input name="hasNeon" type="checkbox" defaultChecked={painting.hasNeon} /> Є неонова версія
          </label>
          <label className={styles.checkboxLabel}>
            <input name="isForSale" type="checkbox" defaultChecked={painting.isForSale} /> Продається
          </label>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Поточне фото</label>
          <Image
            src={painting.coverUrl}
            alt={painting.title}
            width={300}
            height={300}
            style={{ objectFit: "contain", borderRadius: 6 }}
          />
          <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>
            Зображення не змінюється через цю форму.
          </p>
        </div>

        <button type="submit" className={styles.button} disabled={pending}>
          {pending ? "Збереження..." : "Зберегти"}
        </button>
      </form>

      <div className={styles.mediaSidebar}>
        <MediaSection
          paintingId={painting.id}
          items={painting.media.filter((m) => !m.isNeon)}
          isNeon={false}
        />
        <MediaSection
          paintingId={painting.id}
          items={painting.media.filter((m) => m.isNeon)}
          isNeon={true}
        />
      </div>
    </div>
  );
}