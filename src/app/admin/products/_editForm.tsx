"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { updateProductAction } from "./_actions";
import styles from "../_formStyles.module.scss";
import { uploadToCloudinary } from "~/lib/cloudinary-client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useImageCrop } from "~/hooks/use-image-crop";
import ImageCropModal from "~/components/ui/ImageCropModal/ImageCropModal";
import { useSetBreadcrumb } from "@/app/admin/_components/BreadcrumbContext";
import VariantEditor, { type VariantItem } from "./_VariantEditor";

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
type Product = {
  id: number;
  title: string;
  description: string | null;
  price: number;
  stock: number;
  sortOrder: number;
  isFeatured: boolean;
  authorId: number;
  categoryId: number;
  coverUrl: string;
  variants?: ProductVariant[];
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

  const initialVariants: VariantItem[] = (product.variants ?? []).map((v) => ({
    id: v.id,
    title: v.title,
    price: v.price ?? "",
    stock: v.stock,
    sku: v.sku ?? "",
  }));

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h1 style={{ fontSize: "1.35rem", fontWeight: 700, margin: 0, color: "#0f172a" }}>Редагувати товар</h1>
      {state?.error && <p className={styles.error}>{state.error}</p>}
      <input type="hidden" name="id" value={product.id} />

      {/* Card 1: Основна інформація */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Основна інформація</h3>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Назва товару *</label>
            <input className={styles.input} name="title" defaultValue={product.title} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Базова ціна (грн) *</label>
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
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Автор / Художник *</label>
            <select className={styles.select} name="authorId" required defaultValue={product.authorId}>
              {authors.map((a) => (
                <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Категорія товару *</label>
            <select className={styles.select} name="categoryId" required defaultValue={product.categoryId}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Базовий залишок на складі (якщо без варіантів)</label>
            <input className={styles.input} name="stock" type="number" min="0" defaultValue={product.stock} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Порядок сортування в каталозі</label>
            <input className={styles.input} name="sortOrder" type="number" defaultValue={product.sortOrder} />
          </div>
        </div>

        <div className={styles.checkboxField}>
          <input name="isFeatured" type="checkbox" id="isFeatured" defaultChecked={product.isFeatured} />
          <label htmlFor="isFeatured" style={{ cursor: "pointer" }}>
            ⭐ Рекомендований товар (відображати у блоці Featured)
          </label>
        </div>
      </div>

      {/* Card 2: Варіанти та Розміри */}
      <VariantEditor initialVariants={initialVariants} basePrice={price} />

      {/* Card 3: Опис */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Детальний опис товару</h3>
        <div className={styles.field}>
          <div className={styles.editorWrapper}>
            <div className={styles.toolbar}>
              <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()}
                className={editor?.isActive("bold") ? styles.toolbarBtnActive : styles.toolbarBtn}><b>B</b></button>
              <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={editor?.isActive("italic") ? styles.toolbarBtnActive : styles.toolbarBtn}><i>I</i></button>
              <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={editor?.isActive("bulletList") ? styles.toolbarBtnActive : styles.toolbarBtn}>≡ Список</button>
            </div>
            <EditorContent editor={editor} className={styles.editorContent} />
          </div>
          <input type="hidden" name="description" value={description} />
        </div>
      </div>

      {/* Card 4: Головне фото */}
      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Головна обкладинка товару *</h3>
        <div className={styles.field}>
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
              <img src={preview} alt="preview" className={styles.preview} />
            ) : (
              <span>Перетягніть фото або клікніть для вибору</span>
            )}
          </div>
          <input ref={fileInputRef} type="file" name="image" accept="image/*" style={{ display: "none" }}
            onChange={handleFileChange}
          />
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

      <button type="submit" className={styles.submitBtn} disabled={uploading || pending}>
        {uploading ? "Завантаження фото..." : pending ? "Збереження змін..." : "Зберегти зміни"}
      </button>
    </form>
  );
}
