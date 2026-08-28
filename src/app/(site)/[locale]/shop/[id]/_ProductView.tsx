"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShoppingBag, ArrowRight, Check } from "lucide-react";
import { useCart } from "~/context/CartContext";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import ProductCarousel from "~/components/shop/ProductCarousel";
import styles from "./product-page.module.scss";
import { useTranslation } from "~/context/LanguageContext";
import { getLocalized } from "~/lib/i18n";
import { sanitizeHtml } from "~/lib/sanitize-html";

type ProductImage = {
  id: number;
  url: string;
  order: number;
  variantId?: number | null;
};

type ProductVariant = {
  id: number;
  title: string;
  titleUk?: string | null;
  price: number | null;
  stock: number;
  sku?: string | null;
  sortOrder: number;
};

type Author = {
  id: number;
  firstName: string;
  firstNameUk?: string | null;
  lastName: string;
  lastNameUk?: string | null;
  photoUrl?: string | null;
  shortDesc?: string | null;
  shortDescUk?: string | null;
};

type Category = {
  id: number;
  name: string;
  nameUk?: string | null;
  slug: string;
};

export type FullProduct = {
  id: number;
  title: string;
  titleUk?: string | null;
  description: string | null;
  descriptionUk?: string | null;
  price: number;
  stock: number;
  coverUrl: string;
  author: Author;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
};

export default function ProductView({
  product,
  relatedProducts = [],
}: {
  product: FullProduct;
  relatedProducts?: FullProduct[];
}) {
  const { addToCart } = useCart();
  const { t, locale, getLocalizedHref } = useTranslation();

  // Consolidate images (cover + gallery)
  const allImages = useMemo(() => {
    const list: ProductImage[] = [];
    if (product.coverUrl) {
      list.push({ id: 0, url: product.coverUrl, order: -1 });
    }
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        list.push(img);
      }
    }
    return list;
  }, [product.coverUrl, product.images]);

  // Variant Selection
  const hasVariants = product.variants && product.variants.length > 0;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    hasVariants
      ? (product.variants.find((v) => v.stock > 0) ?? product.variants[0] ?? null)
      : null,
  );

  // Filtered gallery images based on selected variant
  const visibleImages = useMemo(() => {
    if (!selectedVariant) return allImages;

    const variantSpecific = allImages.filter(
      (img) => img.variantId === selectedVariant.id,
    );

    if (variantSpecific.length > 0) {
      const untagged = allImages.filter((img) => !img.variantId);
      return [...variantSpecific, ...untagged];
    }

    return allImages;
  }, [allImages, selectedVariant]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const currentPrice = selectedVariant?.price ?? product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setActiveImageIndex(0);
    setQuantity(1);
  };

  const localizedProductTitle = getLocalized(product, "title", locale);
  const localizedProductDesc = getLocalized(product, "description", locale);
  const localizedCategoryName = product.category ? getLocalized(product.category, "name", locale) : "";
  const authorFirstName = product.author ? getLocalized(product.author, "firstName", locale) : "";
  const authorLastName = product.author ? getLocalized(product.author, "lastName", locale) : "";
  const authorFullName = product.author ? `${authorFirstName} ${authorLastName}`.trim() : "";
  const authorShortDesc = product.author ? getLocalized(product.author, "shortDesc", locale) : "";

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addToCart({
      product: {
        id: product.id,
        title: localizedProductTitle,
        price: currentPrice,
        coverUrl: product.coverUrl,
        author: product.author,
        category: product.category,
      },
      variantId: selectedVariant?.id ?? null,
      variantTitle: selectedVariant ? getLocalized(selectedVariant, "title", locale) : null,
      quantity,
      maxStock: currentStock,
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href={getLocalizedHref("/shop")}>{t("nav.shop")}</Link>
        <ChevronRight size={14} />
        {product.category && (
          <>
            <span>{localizedCategoryName}</span>
            <ChevronRight size={14} />
          </>
        )}
        <span className={styles.current}>{localizedProductTitle}</span>
      </nav>

      {/* Main 2-Column Product Layout */}
      <div className={styles.productLayout}>
        {/* Left: Gallery */}
        <div className={styles.galleryCol}>
          <div className={styles.mainImageWrap}>
            {visibleImages[activeImageIndex] ? (
              <Image
                src={getOptimizedImageUrl(visibleImages[activeImageIndex].url, { preset: "large" })}
                alt={localizedProductTitle}
                fill
                priority
                className={styles.mainImage}
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            ) : (
              <div className={styles.imagePlaceholder}>No image</div>
            )}
          </div>

          {/* Thumbnails */}
          {visibleImages.length > 1 && (
            <div className={styles.thumbsList}>
              {visibleImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`${styles.thumbBtn} ${idx === activeImageIndex ? styles.thumbBtnActive : ""}`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <Image
                    src={getOptimizedImageUrl(img.url, { preset: "thumb" })}
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Purchase */}
        <div className={styles.detailsCol}>
          <div className={styles.headerInfo}>
            <span className={styles.categoryBadge}>{localizedCategoryName}</span>
            <h1 className={styles.title}>{localizedProductTitle}</h1>
            <div className={styles.priceRow}>
              <span className={styles.price}>
                {currentPrice.toLocaleString("en-US")} €
              </span>
            </div>
          </div>

          {/* Variant Selector */}
          {hasVariants && (
            <div className={styles.variantSection}>
              <span className={styles.sectionLabel}>{t("shop.selectVariant")}</span>
              <div className={styles.variantChips}>
                {product.variants.map((v) => {
                  const active = selectedVariant?.id === v.id;
                  const outOfStock = v.stock <= 0;
                  const localizedVariantTitle = getLocalized(v, "title", locale);
                  return (
                    <button
                      key={v.id}
                      type="button"
                      disabled={outOfStock}
                      onClick={() => handleVariantSelect(v)}
                      className={`${styles.chip} ${active ? styles.chipActive : ""} ${
                        outOfStock ? styles.chipDisabled : ""
                      }`}
                    >
                      <span>{localizedVariantTitle}</span>
                      {v.price && v.price !== product.price && (
                        <span style={{ fontSize: "0.8rem", marginLeft: "0.35rem", opacity: 0.85 }}>
                          ({v.price.toLocaleString("en-US")} €)
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock Status */}
          <div className={styles.stockStatus}>
            {isOutOfStock ? (
              <span className={styles.stockOut}>✕ {t("shop.outOfStock")}</span>
            ) : (
              <span className={styles.stockIn}>
                ● {t("shop.inStock", { count: currentStock })}
              </span>
            )}
          </div>

          {/* Purchase Actions */}
          <div className={styles.purchaseActions}>
            <div className={styles.qtyPicker}>
              <button
                type="button"
                className={styles.qtyBtn}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1 || isOutOfStock}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className={styles.qtyVal}>{quantity}</span>
              <button
                type="button"
                className={styles.qtyBtn}
                onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                disabled={quantity >= currentStock || isOutOfStock}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={styles.addToCartBtn}
            >
              {addedAnimation ? (
                <>
                  <Check size={18} />
                  <span>{t("shop.addedToCart")}</span>
                </>
              ) : isOutOfStock ? (
                <span>{t("shop.soldOut")}</span>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>{t("shop.addToCart")}</span>
                </>
              )}
            </button>
          </div>

          {/* Description (HTML санітизується — захист від stored XSS) */}
          {localizedProductDesc && (
            <div className={styles.descriptionBox}>
              <h3>{t("shop.productDetails")}</h3>
              <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(localizedProductDesc) }} />
            </div>
          )}

          {/* Author info card */}
          {product.author && (
            <Link href={getLocalizedHref("/art")} className={styles.authorCard}>
              <div className={styles.authorMeta}>
                {product.author.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getOptimizedImageUrl(product.author.photoUrl, { preset: "thumb" })}
                    alt={authorFirstName}
                    className={styles.authorAvatar}
                  />
                ) : (
                  <div
                    className={styles.authorAvatar}
                    style={{
                      background: "#0f172a",
                      color: "#d7ff01",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                    }}
                  >
                    {authorFirstName[0] ?? "V"}
                  </div>
                )}
                <div>
                  <h4 className={styles.authorName}>
                    {authorFullName}
                  </h4>
                  <p className={styles.authorSubtitle}>
                    {authorShortDesc || "VoytArt Gallery Artist"}
                  </p>
                </div>
              </div>
              <ArrowRight size={18} color="#64748b" />
            </Link>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: "5rem", paddingTop: "3rem", borderTop: "1px solid #f1f5f9" }}>
          <ProductCarousel
            title={t("shop.youMayAlsoLike")}
            products={relatedProducts}
            onAddToCart={(relProduct) => {
              addToCart({
                product: {
                  id: relProduct.id,
                  title: getLocalized(relProduct, "title", locale),
                  price: relProduct.price,
                  coverUrl: relProduct.coverUrl ?? "",
                  author: relProduct.author
                    ? {
                        id: relProduct.author.id,
                        firstName: getLocalized(relProduct.author, "firstName", locale),
                        lastName: getLocalized(relProduct.author, "lastName", locale),
                      }
                    : { id: 0, firstName: "VoytArt", lastName: "Artist" },
                  category: relProduct.category ?? undefined,
                },
                variantId: null,
                variantTitle: null,
                quantity: 1,
                maxStock: relProduct.stock,
              });
            }}
          />
        </section>
      )}
    </div>
  );
}
