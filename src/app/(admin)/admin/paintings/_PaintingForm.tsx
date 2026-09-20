"use client";

import { useActionState, useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import dynamic from "next/dynamic";
import { createPaintingAction } from "./new/_actions";
import { updatePaintingAction } from "./edit/_actions";
import { type Author } from "@/types/Author";
import formStyles from "../_formStyles.module.scss";
import LanguageTabs from "../_components/LanguageTabs";
import ImageUploadField from "../_components/ImageUploadField";
import { useUnsavedUploads } from "../_components/UnsavedUploadContext";
import MediaSection from "./edit/_MediaSection";
import { useSetBreadcrumb } from "@/app/(admin)/admin/_components/BreadcrumbContext";

const TipTapEditor = dynamic(() => import("~/components/admin/TipTapEditor"), {
  ssr: false,
  loading: () => (
    <div
      style={{ minHeight: "200px", background: "#f1f5f9", borderRadius: "8px" }}
    />
  ),
});

type PaintingMedia = {
  id: number;
  url: string;
  isNeon: boolean;
  order: number;
  type: "IMAGE" | "VIDEO";
};

export type PaintingItem = {
  id: number;
  title: string;
  titleUk?: string | null;
  description: string | null;
  descriptionUk?: string | null;
  coverUrl: string;
  year: number | null;
  hasNeon: boolean;
  isForSale: boolean;
  authorId: number;
  collectionId: number | null;
  media?: PaintingMedia[];
};

interface PaintingFormProps {
  painting?: PaintingItem;
  authors: Author[];
  collections: { id: number; title: string; authorId: number }[];
}

export default function PaintingForm({
  painting,
  authors,
  collections,
}: PaintingFormProps) {
  const isEdit = Boolean(painting);
  useSetBreadcrumb(painting?.title ?? "Нова картина");

  const actionToUse = isEdit ? updatePaintingAction : createPaintingAction;
  const [state, formAction] = useActionState(actionToUse, undefined);

  const [pending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);

  const [langTab, setLangTab] = useState<"en" | "uk">("en");
  const [description, setDescription] = useState(painting?.description ?? "");
  const [descriptionUk, setDescriptionUk] = useState(painting?.descriptionUk ?? "");

  const [selectedAuthorId, setSelectedAuthorId] = useState(
    painting?.authorId ? String(painting.authorId) : ""
  );
  const [selectedCollectionId, setSelectedCollectionId] = useState(
    painting?.collectionId ? String(painting.collectionId) : ""
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
          <Link href="/admin/paintings" className={formStyles.cancelBtn} style={{ padding: "0.5rem 0.75rem" }}>
            <ArrowLeft size={16} />
            <span>До списку</span>
          </Link>
          <div>
            <h1 className={formStyles.headerTitle}>
              {painting ? `Редагування картини: ${painting.title}` : "Створення нової картини"}
            </h1>
            {painting && (
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
                ID: #{painting.id}
              </p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className={formStyles.submitBtn}
          disabled={pending || isUploading}
        >
          <Save size={16} />
          <span>
            {isUploading
              ? "Завантаження фото..."
              : pending
                ? "Збереження..."
                : painting
                  ? "Зберегти"
                  : "Створити"}
          </span>
        </button>
      </div>

      {state?.error && <p className={formStyles.error}>{state.error}</p>}
      {painting && <input type="hidden" name="id" value={painting.id} />}

      {/* ── 2-Column Grid Layout ───────────────────────────── */}
      <div className={formStyles.formGrid}>
        {/* Main Column */}
        <div className={formStyles.mainColumn}>
          {/* Card 1: Basic details */}
          <div className={formStyles.card}>
            <div className={formStyles.cardHeader}>
              <h3 className={formStyles.cardTitle}>Основні реквізити</h3>
              <span className={formStyles.cardDesc}>Назва, рік та опис картини</span>
            </div>

            <LanguageTabs activeTab={langTab} onChange={setLangTab} />

            <div style={{ display: langTab === "en" ? "block" : "none" }}>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Title (EN) *</label>
                <input
                  className={formStyles.input}
                  name="title"
                  defaultValue={painting?.title ?? ""}
                  placeholder="Painting title in English"
                  required
                />
              </div>

              <div className={formStyles.field}>
                <label className={formStyles.label}>Description (EN)</label>
                <TipTapEditor
                  content={description}
                  onChange={setDescription}
                />
              </div>
            </div>

            <div style={{ display: langTab === "uk" ? "block" : "none" }}>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Назва (Українська)</label>
                <input
                  className={formStyles.input}
                  name="titleUk"
                  defaultValue={painting?.titleUk ?? ""}
                  placeholder="Назва картини українською"
                />
              </div>

              <div className={formStyles.field}>
                <label className={formStyles.label}>Опис (Українська)</label>
                <TipTapEditor
                  content={descriptionUk}
                  onChange={setDescriptionUk}
                />
              </div>
            </div>

            <div className={formStyles.field}>
              <label className={formStyles.label}>Рік створення</label>
              <input
                className={formStyles.input}
                name="year"
                type="number"
                defaultValue={painting?.year ?? ""}
                placeholder="наприклад: 2024"
              />
            </div>
          </div>

          {/* Card 2: Author & Collection */}
          <div className={formStyles.card}>
            <div className={formStyles.cardHeader}>
              <h3 className={formStyles.cardTitle}>Автор та колекція</h3>
            </div>

            <div className={formStyles.row}>
              <div className={formStyles.field}>
                <label className={formStyles.label}>Автор *</label>
                <select
                  className={formStyles.select}
                  name="authorId"
                  value={selectedAuthorId}
                  onChange={handleAuthorChange}
                  required
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
          </div>

          {/* Additional Media Sections (only in edit mode when painting exists) */}
          {painting?.media && (
            <>
              <div className={formStyles.card}>
                <div className={formStyles.cardHeader}>
                  <h3 className={formStyles.cardTitle}>Галерея додаткових медіа</h3>
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
            </>
          )}
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
                defaultChecked={painting?.hasNeon ?? false}
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
                defaultChecked={painting?.isForSale ?? false}
              />
            </div>
          </div>

          {/* Cover Image using ImageUploadField */}
          <div className={formStyles.card}>
            <div className={formStyles.cardHeader}>
              <h3 className={formStyles.cardTitle}>Головне фото</h3>
            </div>

            <ImageUploadField
              name="coverUrl"
              label="Головна обкладинка"
              folder="voytart/paintings"
              initialUrl={painting?.coverUrl}
              required={!painting}
              helpText="Головне зображення картини для галереї"
              onUploadingChange={setIsUploading}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
