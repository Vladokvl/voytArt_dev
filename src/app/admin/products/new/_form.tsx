"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { createProductAction } from "../_actions";
import styles from "../../_formStyles.module.scss";
import { uploadToCloudinary } from "~/lib/cloudinary-client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useImageCrop } from "~/hooks/use-image-crop";
import ImageCropModal from "~/components/ui/ImageCropModal/ImageCropModal";
import VariantEditor from "../_VariantEditor";
import { ArrowLeft, Save, Plus } from "lucide-react";

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
  const [price, setPrice] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    immediatelyRender: false,
    onUpdate: ({ editor }) => setDescription(editor.getHTML()),
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
      {/* ── Sticky Top Bar ─────────────────────────────────── */}
      <div className={styles.formHeaderSticky}>
        <div className={styles.headerTitleWrap}>
          <Link href="/admin/products" className={styles.cancelBtn} style={{ padding: "0.5rem 0.75rem" }}>
            <ArrowLeft size={16} />
            <span>До списку</span>
          </Link>
          <div>
            <h1 className={styles.headerTitle}>Створення нового товару</h1>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
              Заповніть деталі товару для магазину
            </p>
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={uploading || pending}
        >
          <Plus size={16} />
          <span>{uploading ? "Завантаження фото..." : pending ? "Створення..." : "Створити товар"}</span>
        </button>
      </div>

      {state?.error && <p className={styles.error}>{state.error}</p>}

      {/* ── 2-Column Grid Layout ───────────────────────────── */}
      <div className={styles.formGrid}>
        {/* Main Column */}
        <div className={styles.mainColumn}>
          {/* Card 1: Основна інформація */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Основна інформація</h3>
              <span className={styles.cardDesc}>Базові реквізити товару</span>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Назва товару *</label>
              <input
                className={styles.input}
                name="title"
                placeholder="напр. Худі VoytArt 'Мотанка'"
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Базова ціна (€) *</label>
                <input
                  className={styles.input}
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Базовий залишок на складі</label>
                <input
                  className={styles.input}
                  name="stock"
                  type="number"
                  min="0"
                  defaultValue="0"
                  placeholder="Якщо без варіантів"
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Автор / Художник *</label>
                <select className={styles.select} name="authorId" required defaultValue="">
                  <option value="" disabled>
                    Оберіть автора
                  </option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.firstName} {a.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Категорія *</label>
                <select className={styles.select} name="categoryId" required defaultValue="">
                  <option value="" disabled>
                    Оберіть категорію
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Card 2: Варіанти та Розміри */}
          <VariantEditor basePrice={price} />

          {/* Card 3: Опис */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Детальний опис товару</h3>
              <span className={styles.cardDesc}>Матеріали, догляд та опис</span>
            </div>
            <div className={styles.field}>
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
              <input type="hidden" name="description" value={description} />
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className={styles.sidebarColumn}>
          {/* Status & Visibility Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Видимість та статус</h3>
            </div>

            <div className={styles.checkboxField}>
              <div>
                <span style={{ fontWeight: 600, display: "block" }}>Активний у магазині</span>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  Одразу опублікувати товар для покупців
                </span>
              </div>
              <input
                name="isActive"
                type="checkbox"
                id="isActive"
                defaultChecked={true}
              />
            </div>

            <div className={styles.checkboxField}>
              <div>
                <span style={{ fontWeight: 600, display: "block" }}>⭐ Рекомендований</span>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  Показувати в блоці Featured
                </span>
              </div>
              <input
                name="isFeatured"
                type="checkbox"
                id="isFeatured"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Порядок сортування</label>
              <input
                className={styles.input}
                name="sortOrder"
                type="number"
                defaultValue="0"
              />
            </div>
          </div>

          {/* Cover Photo Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Головна обкладинка *</h3>
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
                  <span>Перетягніть фото або клікніть для вибору</span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                accept="image/*"
                required
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
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

      {/* Bottom Save Bar */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
        <Link href="/admin/products" className={styles.cancelBtn}>
          Скасувати
        </Link>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={uploading || pending}
        >
          <Save size={16} />
          <span>{uploading ? "Завантаження..." : pending ? "Створення..." : "Створити товар"}</span>
        </button>
      </div>
    </form>
  );
}
