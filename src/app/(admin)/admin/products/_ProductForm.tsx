"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, ExternalLink, Save, Eye, Plus } from "lucide-react";
import { createProductAction, updateProductAction } from "./_actions";
import formStyles from "../_formStyles.module.scss";
import LanguageTabs from "../_components/LanguageTabs";
import ImageUploadField from "../_components/ImageUploadField";
import { useUnsavedUploads } from "../_components/UnsavedUploadContext";
import VariantEditor, { type VariantItem } from "./_VariantEditor";
import MediaSection from "./edit/[id]/_MediaSection";
import { useSetBreadcrumb } from "@/app/(admin)/admin/_components/BreadcrumbContext";

const TipTapEditor = dynamic(() => import("~/components/admin/TipTapEditor"), {
  ssr: false,
  loading: () => (
    <div
      className="skeleton-editor"
      style={{ minHeight: "200px", background: "#f1f5f9", borderRadius: "8px" }}
    />
  ),
});

type Author = { id: number; firstName: string; lastName: string };
type Category = { id: number; name: string };
type ProductVariant = {
  id: number;
  title: string;
  titleUk?: string | null;
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
export type ProductItem = {
  id: number;
  title: string;
  titleUk?: string | null;
  description: string | null;
  descriptionUk?: string | null;
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

interface ProductFormProps {
  product?: ProductItem;
  authors: Author[];
  categories: Category[];
}

export default function ProductForm({
  product,
  authors,
  categories,
}: ProductFormProps) {
  const isEdit = Boolean(product);
  useSetBreadcrumb(product?.title ?? "Новий товар");

  const actionToUse = isEdit ? updateProductAction : createProductAction;
  const [state, formAction] = useActionState(actionToUse, undefined);

  const [pending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  const [langTab, setLangTab] = useState<"en" | "uk">("en");
  const [description, setDescription] = useState(product?.description ?? "");
  const [descriptionUk, setDescriptionUk] = useState(product?.descriptionUk ?? "");
  const [price, setPrice] = useState<number>(product?.price ?? 0);

  const initialVariants: VariantItem[] = (product?.variants ?? []).map((v) => ({
    id: v.id,
    title: v.title,
    titleUk: v.titleUk ?? "",
    price: v.price ?? "",
    stock: v.stock,
    sku: v.sku ?? "",
  }));

  const [currentVariants, setCurrentVariants] = useState<VariantItem[]>(initialVariants);

  // Convert currentVariants to format expected by MediaSection
  const mediaVariantOptions = currentVariants
    .filter((v) => v.title.trim().length > 0)
    .map((v, i) => ({
      id: v.id ?? -(i + 1),
      title: v.title,
    }));

  const { commitStagedUrls } = useUnsavedUploads();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    commitStagedUrls();
    const formData = new FormData(e.currentTarget);
    formData.set("description", description);
    formData.set("descriptionUk", descriptionUk);

    startTransition(() => {
      formAction(formData);
    });
  }

  return (
    <form onSubmit={handleSubmit} className={formStyles.form}>
      {/* ── Sticky Top Bar ─────────────────────────────────── */}
      <div className={formStyles.formHeaderSticky}>
        <div className={formStyles.headerTitleWrap}>
          <Link href="/admin/products" className={formStyles.cancelBtn} style={{ padding: "0.5rem 0.75rem" }}>
            <ArrowLeft size={16} />
            <span>До списку</span>
          </Link>
          <div>
            <h1 className={formStyles.headerTitle}>
              {product ? `Редагування: ${product.title}` : "Створення нового товару"}
            </h1>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
              {product
                ? `ID товару: #${product.id} • ${product.category?.name ?? "Товар"}`
                : "Заповніть деталі товару для магазину"}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {product && (
            <Link
              href={`/shop/${product.id}`}
              target="_blank"
              className={formStyles.cancelBtn}
              title="Переглянути сторінку товару у магазині"
            >
              <Eye size={15} />
              <span>На сайті</span>
              <ExternalLink size={12} />
            </Link>
          )}

          <button
            type="submit"
            className={formStyles.submitBtn}
            disabled={pending || isUploading}
          >
            {product ? <Save size={16} /> : <Plus size={16} />}
            <span>
              {isUploading
                ? "Завантаження фото..."
                : pending
                  ? isEdit
                    ? "Збереження..."
                    : "Створення..."
                  : isEdit
                    ? "Зберегти"
                    : "Створити товар"}
            </span>
          </button>
        </div>
      </div>

      {state?.error && <p className={formStyles.error}>{state.error}</p>}
      {product && <input type="hidden" name="id" value={product.id} />}

      {/* ── 2-Column Grid Layout ───────────────────────────── */}
      <div className={formStyles.formGrid}>
        {/* Main Column */}
        <div className={formStyles.mainColumn}>
          {/* Card 1: Основна інформація */}
          <div className={formStyles.card}>
            <div className={formStyles.cardHeader}>
              <h3 className={formStyles.cardTitle}>Основна інформація</h3>
              <span className={formStyles.cardDesc}>Базові реквізити товару</span>
            </div>

            <LanguageTabs activeTab={langTab} onChange={setLangTab} />

            <div style={{ display: langTab === "en" ? "block" : "none" }}>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Title (EN) *</label>
                <input
                  className={formStyles.input}
                  name="title"
                  defaultValue={product?.title ?? ""}
                  placeholder="e.g. Hoodie VoytArt 'Motanka'"
                  required
                />
              </div>
            </div>

            <div style={{ display: langTab === "uk" ? "block" : "none" }}>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Назва товару (Українська)</label>
                <input
                  className={formStyles.input}
                  name="titleUk"
                  defaultValue={product?.titleUk ?? ""}
                  placeholder="напр. Худі VoytArt 'Мотанка'"
                />
              </div>
            </div>

            <div className={formStyles.row}>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Базова ціна (€) *</label>
                <input
                  className={formStyles.input}
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={product?.price}
                  placeholder="0.00"
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Базовий залишок на складі</label>
                <input
                  className={formStyles.input}
                  name="stock"
                  type="number"
                  min="0"
                  defaultValue={product?.stock ?? 0}
                  placeholder="Якщо без варіантів"
                />
              </div>
            </div>

            <div className={formStyles.row}>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Автор / Художник *</label>
                <select
                  className={formStyles.select}
                  name="authorId"
                  required
                  defaultValue={product?.authorId ?? ""}
                >
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
              <div className={formStyles.field}>
                <label className={formStyles.label}>Категорія *</label>
                <select
                  className={formStyles.select}
                  name="categoryId"
                  required
                  defaultValue={product?.categoryId ?? ""}
                >
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
          <VariantEditor
            initialVariants={initialVariants}
            basePrice={price}
            onChange={(updated) => setCurrentVariants(updated)}
          />

          {/* Card 3: Додаткові фотографії (тільки при редагуванні існуючого товару) */}
          {product && (
            <MediaSection
              productId={product.id}
              items={product.images ?? []}
              variants={mediaVariantOptions}
            />
          )}

          {/* Card 4: Детальний опис товару */}
          <div className={formStyles.card}>
            <div className={formStyles.cardHeader}>
              <h3 className={formStyles.cardTitle}>Детальний опис товару</h3>
              <span className={formStyles.cardDesc}>Матеріали, догляд та опис</span>
            </div>

            <div style={{ display: langTab === "en" ? "block" : "none" }}>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Description (EN)</label>
                <TipTapEditor
                  content={description}
                  onChange={(html) => setDescription(html)}
                />
              </div>
            </div>

            <div style={{ display: langTab === "uk" ? "block" : "none" }}>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Опис товару (Українська)</label>
                <TipTapEditor
                  content={descriptionUk}
                  onChange={(html) => setDescriptionUk(html)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column */}
        <div className={formStyles.sidebarColumn}>
          {/* Status & Visibility Card */}
          <div className={formStyles.card}>
            <div className={formStyles.cardHeader}>
              <h3 className={formStyles.cardTitle}>Видимість та статус</h3>
            </div>

            <div className={formStyles.checkboxField}>
              <div>
                <span style={{ fontWeight: 600, display: "block" }}>Активний у магазині</span>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  {product ? "Якщо вимкнено — товар приховано для покупців" : "Одразу опублікувати товар для покупців"}
                </span>
              </div>
              <input
                name="isActive"
                type="checkbox"
                id="isActive"
                defaultChecked={product?.isActive ?? true}
              />
            </div>

            <div className={formStyles.checkboxField}>
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
                defaultChecked={product?.isFeatured ?? false}
              />
            </div>

            <div className={formStyles.field}>
              <label className={formStyles.label}>Порядок сортування</label>
              <input
                className={formStyles.input}
                name="sortOrder"
                type="number"
                defaultValue={product?.sortOrder ?? 0}
              />
            </div>
          </div>

          {/* Cover Photo Card */}
          <div className={formStyles.card}>
            <div className={formStyles.cardHeader}>
              <h3 className={formStyles.cardTitle}>Головна обкладинка *</h3>
            </div>

            <ImageUploadField
              name="coverUrl"
              label="Головна обкладинка"
              folder="voytart/products"
              initialUrl={product?.coverUrl}
              required={!product}
              helpText="Головне фото для магазину та карток товарів"
              onUploadingChange={setIsUploading}
            />
          </div>
        </div>
      </div>

      {/* Bottom Save Bar */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
        <Link href="/admin/products" className={formStyles.cancelBtn}>
          Скасувати
        </Link>
        <button
          type="submit"
          className={formStyles.submitBtn}
          disabled={pending || isUploading}
        >
          {product ? <Save size={16} /> : <Plus size={16} />}
          <span>
            {isUploading
              ? "Завантаження..."
              : pending
                ? isEdit
                  ? "Збереження..."
                  : "Створення..."
                : isEdit
                  ? "Зберегти зміни"
                  : "Створити товар"}
          </span>
        </button>
      </div>
    </form>
  );
}
