"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { updatePaintingAction } from "./_actions";
import { type Author } from "@/types/Author";
import formStyles from "@/app/admin/_formStyles.module.scss";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "next/image";
import MediaSection from "./_MediaSection";
import { useSetBreadcrumb } from "@/app/admin/_components/BreadcrumbContext";
import { ArrowLeft, Save } from "lucide-react";

type PaintingMedia = { id: number; url: string; isNeon: boolean; order: number; type: "IMAGE" | "VIDEO" };

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
  useSetBreadcrumb(painting.title);
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
    <form onSubmit={handleSubmit} className={formStyles.form}>
      {/* ── Sticky Top Bar ─────────────────────────────────── */}
      <div className={formStyles.formHeaderSticky}>
        <div className={formStyles.headerTitleWrap}>
          <Link href="/admin/paintings" className={formStyles.cancelBtn} style={{ padding: "0.5rem 0.75rem" }}>
            <ArrowLeft size={16} />
            <span>До списку</span>
          </Link>
          <div>
            <h1 className={formStyles.headerTitle}>Редагування картини: {painting.title}</h1>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
              ID: #{painting.id}
            </p>
          </div>
        </div>

        <button type="submit" className={formStyles.submitBtn} disabled={pending}>
          <Save size={16} />
          <span>{pending ? "Збереження..." : "Зберегти"}</span>
        </button>
      </div>

      {state?.error && <p className={formStyles.error}>{state.error}</p>}
      <input type="hidden" name="id" value={String(painting.id)} />
      <input type="hidden" name="coverUrl" value={painting.coverUrl} />

      {/* ── 2-Column Grid Layout ───────────────────────────── */}
      <div className={formStyles.formGrid}>
        {/* Main Column */}
        <div className={formStyles.mainColumn}>
          {/* Card 1: Основні дані */}
          <div className={formStyles.card}>
            <div className={formStyles.cardHeader}>
              <h3 className={formStyles.cardTitle}>Основна інформація</h3>
              <span className={formStyles.cardDesc}>Назва, автор та колекція</span>
            </div>

            <div className={formStyles.field}>
              <label className={formStyles.label}>Назва картини *</label>
              <input
                className={formStyles.input}
                name="title"
                placeholder="Назва картини"
                defaultValue={painting.title}
                required
              />
            </div>

            <div className={formStyles.row}>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Автор *</label>
                <select
                  className={formStyles.select}
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

              <div className={formStyles.field}>
                <label className={formStyles.label}>Колекція</label>
                <select
                  className={formStyles.select}
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
            </div>

            <div className={formStyles.row}>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Рік створення</label>
                <input
                  className={formStyles.input}
                  name="year"
                  type="number"
                  placeholder="2024"
                  defaultValue={painting.year ?? ""}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Опис картини */}
          <div className={formStyles.card}>
            <div className={formStyles.cardHeader}>
              <h3 className={formStyles.cardTitle}>Опис картини</h3>
              <span className={formStyles.cardDesc}>Історія та деталі полотна</span>
            </div>

            <div className={formStyles.field}>
              <div className={formStyles.editorWrapper}>
                <div className={formStyles.toolbar}>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className={editor?.isActive("bold") ? formStyles.toolbarBtnActive : formStyles.toolbarBtn}
                  >
                    <b>B</b>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className={editor?.isActive("italic") ? formStyles.toolbarBtnActive : formStyles.toolbarBtn}
                  >
                    <i>I</i>
                  </button>
                  <button
                    type="button"
                    onClick={() => editor?.chain().focus().toggleBulletList().run()}
                    className={editor?.isActive("bulletList") ? formStyles.toolbarBtnActive : formStyles.toolbarBtn}
                  >
                    ≡ Список
                  </button>
                </div>
                <EditorContent editor={editor} className={formStyles.editorContent} />
              </div>
              <input type="hidden" name="description" value={description} />
            </div>
          </div>

          {/* Card 3 & 4: Додаткові медіа (Звичайні та Неонові) */}
          <div className={formStyles.card}>
            <div className={formStyles.cardHeader}>
              <h3 className={formStyles.cardTitle}>Додаткові фотографії картини</h3>
            </div>
            <MediaSection
              paintingId={painting.id}
              items={painting.media.filter((m) => !m.isNeon)}
              isNeon={false}
            />
          </div>

          <div className={formStyles.card}>
            <div className={formStyles.cardHeader}>
              <h3 className={formStyles.cardTitle}>⚡ Неонові версії картини (UV)</h3>
            </div>
            <MediaSection
              paintingId={painting.id}
              items={painting.media.filter((m) => m.isNeon)}
              isNeon={true}
            />
          </div>
        </div>

        {/* Sidebar Column */}
        <div className={formStyles.sidebarColumn}>
          {/* Status & Options */}
          <div className={formStyles.card}>
            <div className={formStyles.cardHeader}>
              <h3 className={formStyles.cardTitle}>Опції картини</h3>
            </div>

            <div className={formStyles.checkboxField}>
              <div>
                <span style={{ fontWeight: 600, display: "block" }}>⚡ Є неонова версія</span>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  Дозволяє перемикач UV на сторінці
                </span>
              </div>
              <input
                name="hasNeon"
                type="checkbox"
                id="hasNeon"
                defaultChecked={painting.hasNeon}
              />
            </div>

            <div className={formStyles.checkboxField}>
              <div>
                <span style={{ fontWeight: 600, display: "block" }}>🏷️ Продається</span>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  Показувати бейдж продажу
                </span>
              </div>
              <input
                name="isForSale"
                type="checkbox"
                id="isForSale"
                defaultChecked={painting.isForSale}
              />
            </div>
          </div>

          {/* Cover Image */}
          <div className={formStyles.card}>
            <div className={formStyles.cardHeader}>
              <h3 className={formStyles.cardTitle}>Головне фото</h3>
            </div>

            <div className={formStyles.previewWrap}>
              <Image
                src={painting.coverUrl}
                alt={painting.title}
                width={280}
                height={280}
                style={{ objectFit: "contain", borderRadius: "6px" }}
              />
            </div>
            <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0, textAlign: "center" }}>
              Головна обкладинка картини
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
        <Link href="/admin/paintings" className={formStyles.cancelBtn}>
          Скасувати
        </Link>
        <button type="submit" className={formStyles.submitBtn} disabled={pending}>
          <Save size={16} />
          <span>{pending ? "Збереження..." : "Зберегти зміни"}</span>
        </button>
      </div>
    </form>
  );
}