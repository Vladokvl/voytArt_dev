"use client";

import { useState } from "react";
import { Plus, Trash2, Sparkles, Layers } from "lucide-react";
import styles from "../_formStyles.module.scss";

export type VariantItem = {
  id?: number;
  title: string;
  price: number | string;
  stock: number | string;
  sku?: string;
};

export default function VariantEditor({
  initialVariants = [],
  basePrice = 0,
}: {
  initialVariants?: VariantItem[];
  basePrice?: number;
}) {
  const [variants, setVariants] = useState<VariantItem[]>(initialVariants);

  const addVariant = (title = "", price = "", stock = 5) => {
    setVariants((prev) => [
      ...prev,
      {
        title,
        price,
        stock,
        sku: "",
      },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof VariantItem, val: string | number) => {
    setVariants((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  };

  const applyClothingSizes = () => {
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
    setVariants(
      sizes.map((s) => ({
        title: s,
        price: "",
        stock: 5,
        sku: "",
      }))
    );
  };

  const applyPrintSizes = () => {
    const prints = [
      { title: "A4 (21×30 см)", price: Math.round(basePrice * 0.7) || "" },
      { title: "A3 (30×42 см)", price: basePrice || "" },
      { title: "A2 (42×60 см)", price: Math.round(basePrice * 1.5) || "" },
      { title: "A1 (60×84 см)", price: Math.round(basePrice * 2.2) || "" },
    ];
    setVariants(
      prints.map((p) => ({
        title: p.title,
        price: p.price,
        stock: 10,
        sku: "",
      }))
    );
  };

  return (
    <div className={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <div>
          <h3 className={styles.cardTitle} style={{ border: "none", padding: 0 }}>
            Варіанти товару (Розміри / Формати)
          </h3>
          <p style={{ fontSize: "0.8rem", color: "#64748b", margin: "0.25rem 0 0" }}>
            Додайте розміри або модифікації з індивідуальними залишками на складі.
          </p>
        </div>

        {/* Preset Buttons */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={applyClothingSizes}
            className={styles.toolbarBtn}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", border: "1px solid #e2e8f0" }}
          >
            <Sparkles size={13} color="#7c3aed" />
            <span>Розміри одягу (XS–XXL)</span>
          </button>
          <button
            type="button"
            onClick={applyPrintSizes}
            className={styles.toolbarBtn}
            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem", border: "1px solid #e2e8f0" }}
          >
            <Layers size={13} color="#2563eb" />
            <span>Формати принтів (A4–A1)</span>
          </button>
        </div>
      </div>

      {variants.length === 0 ? (
        <div
          style={{
            padding: "1.5rem",
            background: "#f8fafc",
            border: "1px dashed #cbd5e1",
            borderRadius: "8px",
            textAlign: "center",
            color: "#64748b",
            fontSize: "0.85rem",
          }}
        >
          <p style={{ margin: "0 0 0.75rem" }}>
            Варіантів ще немає. Буде використовуватись загальна ціна та залишок товару.
          </p>
          <button
            type="button"
            onClick={() => addVariant("Розмір S")}
            className={styles.submitBtn}
            style={{ padding: "0.45rem 1rem", fontSize: "0.825rem", margin: "0 auto" }}
          >
            <Plus size={14} />
            <span>Додати перший варіант</span>
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 40px",
              gap: "0.5rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "#64748b",
              textTransform: "uppercase",
              padding: "0 0.5rem",
            }}
          >
            <span>Назва варіанту / Розмір *</span>
            <span>Ціна (₴, опц.)</span>
            <span>Залишок (шт) *</span>
            <span>Артикул / SKU</span>
            <span></span>
          </div>

          {variants.map((v, idx) => (
            <div
              key={idx}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 40px",
                gap: "0.5rem",
                alignItems: "center",
                background: "#f8fafc",
                padding: "0.5rem",
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
              }}
            >
              <input
                className={styles.input}
                style={{ padding: "0.45rem 0.65rem", fontSize: "0.85rem" }}
                value={v.title}
                placeholder="напр. Розмір M"
                onChange={(e) => updateVariant(idx, "title", e.target.value)}
                required
              />
              <input
                className={styles.input}
                style={{ padding: "0.45rem 0.65rem", fontSize: "0.85rem" }}
                type="number"
                step="0.01"
                min="0"
                value={v.price}
                placeholder="Як у товару"
                onChange={(e) => updateVariant(idx, "price", e.target.value)}
              />
              <input
                className={styles.input}
                style={{ padding: "0.45rem 0.65rem", fontSize: "0.85rem" }}
                type="number"
                min="0"
                value={v.stock}
                placeholder="0"
                onChange={(e) => updateVariant(idx, "stock", e.target.value)}
                required
              />
              <input
                className={styles.input}
                style={{ padding: "0.45rem 0.65rem", fontSize: "0.85rem" }}
                value={v.sku ?? ""}
                placeholder="SKU"
                onChange={(e) => updateVariant(idx, "sku", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeVariant(idx)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  border: "1px solid #fee2e2",
                  borderRadius: "6px",
                  background: "#ffffff",
                  color: "#ef4444",
                  cursor: "pointer",
                }}
                title="Видалити варіант"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => addVariant("")}
            className={styles.toolbarBtn}
            style={{
              alignSelf: "flex-start",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              marginTop: "0.25rem",
              border: "1px solid #e2e8f0",
              fontSize: "0.85rem",
              padding: "0.45rem 0.85rem",
            }}
          >
            <Plus size={14} />
            <span>+ Додати ще варіант</span>
          </button>
        </div>
      )}

      {/* Serialized JSON input for form submission */}
      <input type="hidden" name="variantsJson" value={JSON.stringify(variants)} />
    </div>
  );
}
