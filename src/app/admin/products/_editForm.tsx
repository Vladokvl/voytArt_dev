"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { updateProductAction } from "./_actions";
import styles from "../_formStyles.module.scss";
import { uploadToCloudinary } from "~/lib/cloudinary-client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useImageCrop } from "~/hooks/use-image-crop";
import ImageCropModal from "~/components/ui/ImageCropModal/ImageCropModal";
import { useSetBreadcrumb } from "@/app/admin/_components/BreadcrumbContext";
import VariantEditor, { type VariantItem } from "./_VariantEditor";
import MediaSection from "./edit/[id]/_MediaSection";
import { ArrowLeft, ExternalLink, Save, Eye, CheckCircle2 } from "lucide-react";

type Author = { id: number; firstName: string; lastName: string };
type Category = { id: number; name: string };
type ProductVariant = {
  id: number;
  title: string;
  price: number | null;
  stock: number;
  sku: string | null;
  sortOrder: number;
};
type ProductImage = {
  id: number;
  url: string;
  order: number;
  variantId?: number | null;
};
type Product = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  stock: number;
  sortOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  authorId: number;
  categoryId: number;
  category?: Category;
  coverUrl: string;
  variants?: ProductVariant[];
  images?: ProductImage[];
};

export default function ProductEditForm({
  product,
  authors,
  categories,
}: {
  product: Product;
  authors: Author[];
  categories: Category[];
}) {
  useSetBreadcrumb(product.title);
  const [state, formAction] = useActionState(updateProductAction, undefined);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [description, setDescription] = useState(product.description ?? "");
  const [preview, setPreview] = useState<string | null>(product.coverUrl || null);
  const [dragOver, setDragOver] = useState(false);
  const [price, setPrice] = useState<number>(product.price);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialVariants: VariantItem[] = (product.variants ?? []).map((v) => ({
    id: v.id,
    title: v.title,
    price: v.price ?? "",
    stock: v.stock,
    sku: v.sku ?? "",
  }));

  const [currentVariants, setCurrentVariants] = useState<VariantItem[]>(initialVariants);

  const editor = useEditor({
    extensions: [StarterKit],
    content: product.description ?? "",
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
    let coverUrl = product.coverUrl;

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

  // Convert currentVariants to format expected by MediaSection
  const mediaVariantOptions = currentVariants
    .filter((v) => v.title.trim().length > 0)
    .map((v, i) => ({
      id: v.id ?? -(i + 1), // fallback negative id if newly added
      title: v.title,
    }));

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
            <h1 className={styles.headerTitle}>Редагування: {product.title}</h1>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
              ID товару: #{product.id} • {product.category?.name || "Товар"}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <Link
            href={`/shop/${product.id}`}
            target="_blank"
            className={styles.cancelBtn}
            title="Переглянути сторінку товару у магазині"
          >
            <Eye size={15} />
            <span>На сайті</span>
            <ExternalLink size={12} />
          </Link>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={uploading || pending}
          >
            <Save size={16} />
            <span>{uploading ? "Завантаження фото..." : pending ? "Збереження..." : "Зберегти"}</span>
          </button>
        </div>
      </div>

      {state?.error && <p className={styles.error}>{state.error}</p>}
      <input type="hidden" name="id" value={product.id} />

      {/* ── 2-Column Grid Layout ───────────────────────────── */}
      <div className={styles.formGrid}>
        {/* Main Column */}
        <div className={styles.mainColumn}>
          {/* Card 1: Основні дані */}
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
                defaultValue={product.title}
                placeholder="напр. Фірмове худі VoytArt Black"
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
                  defaultValue={product.price}
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Базовий залишок (шт)</label>
                <input
                  className={styles.input}
                  name="stock"
                  type="number"
                  min="0"
                  defaultValue={product.stock}
                  placeholder="Авторозрахунок з варіантів"
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Автор / Художник *</label>
                <select className={styles.select} name="authorId" required defaultValue={product.authorId}>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.firstName} {a.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Категорія *</label>
                <select className={styles.select} name="categoryId" required defaultValue={product.categoryId}>
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
          <VariantEditor
            initialVariants={initialVariants}
            basePrice={price}
            onChange={(updated) => setCurrentVariants(updated)}
          />

          {/* Card 3: Додаткові фотографії та прив'язка до варіантів */}
          <MediaSection
            productId={product.id}
            items={product.images ?? []}
            variants={mediaVariantOptions}
          />

          {/* Card 4: Детальний опис товару */}
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
                  Якщо вимкнено — товар приховано для покупців
                </span>
              </div>
              <input
                name="isActive"
                type="checkbox"
                id="isActive"
                defaultChecked={product.isActive ?? true}
              />
            </div>

            <div className={styles.checkboxField}>
              <div>
                <span style={{ fontWeight: 600, display: "block" }}>⭐ Рекомендований</span>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  Показувати в каруселі Featured
                </span>
              </div>
              <input
                name="isFeatured"
                type="checkbox"
                id="isFeatured"
                defaultChecked={product.isFeatured}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Порядок сортування</label>
              <input
                className={styles.input}
                name="sortOrder"
                type="number"
                defaultValue={product.sortOrder}
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
          <span>{uploading ? "Завантаження..." : pending ? "Збереження..." : "Зберегти зміни"}</span>
        </button>
      </div>
    </form>
  );
}
