"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Check, ChevronRight, ArrowRight } from "lucide-react";
import styles from "./product-page.module.scss";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";

type ProductImage = { id: number; url: string; order: number; variantId?: number | null };
type ProductVariant = {
  id: number;
  title: string;
  price: number | null;
  stock: number;
  sku: string | null;
};
type Author = { id: number; firstName: string; lastName: string; photoUrl: string | null; shortDesc: string | null };
type Category = { id: number; name: string; slug: string };

type CartItem = {
  product: {
    id: number;
    title: string;
    price: number;
    coverUrl: string;
    author: Author;
    category: Category;
  };
  variantId: number | null;
  variantTitle: string | null;
  quantity: number;
};

export type FullProduct = {
  id: number;
  title: string;
  description: string | null;
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
  relatedProducts: _relatedProducts = [],
}: {
  product: FullProduct;
  relatedProducts?: FullProduct[];
}) {
  // All available product images
  const allImages = useMemo(() => {
    const list: ProductImage[] = [{ id: 0, url: product.coverUrl, order: -1, variantId: null }];
    for (const img of product.images) {
      if (img.url !== product.coverUrl) {
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
      : null
  );

  // Filtered gallery images based on selected variant
  const visibleImages = useMemo(() => {
    if (!selectedVariant) return allImages;

    // Check if there are images specifically assigned to this variant
    const variantSpecific = allImages.filter(
      (img) => img.variantId === selectedVariant.id
    );

    if (variantSpecific.length > 0) {
      // Show variant-specific images + general untagged images
      const untagged = allImages.filter((img) => !img.variantId);
      return [...variantSpecific, ...untagged];
    }

    return allImages;
  }, [allImages, selectedVariant]);

  const [activeImage, setActiveImage] = useState(
    visibleImages[0]?.url ?? product.coverUrl
  );

  // When variant changes, auto-switch active image to the first photo of this variant
  const handleVariantSelect = (v: ProductVariant) => {
    setSelectedVariant(v);
    setQuantity(1);

    const variantPhoto = allImages.find((img) => img.variantId === v.id);
    if (variantPhoto) {
      setActiveImage(variantPhoto.url);
    }
  };

  // When clicking a thumbnail, if it's tied to a variant, also auto-select that variant
  const handleThumbnailClick = (img: ProductImage) => {
    setActiveImage(img.url);
    if (img.variantId && hasVariants) {
      const matchedVariant = product.variants.find((v) => v.id === img.variantId);
      if (matchedVariant) {
        setSelectedVariant(matchedVariant);
      }
    }
  };

  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Active Price & Stock
  const currentPrice = selectedVariant?.price ?? product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const isOutOfStock = currentStock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    // Read cart from localStorage
    const savedCart = localStorage.getItem("voyt_art_cart");
    let cart: CartItem[] = [];
    if (savedCart) {
      try {
        cart = JSON.parse(savedCart) as CartItem[];
      } catch (e) {
        console.error(e);
      }
    }

    const existingIndex = cart.findIndex((item) =>
      selectedVariant
        ? item.product.id === product.id && item.variantId === selectedVariant.id
        : item.product.id === product.id && !item.variantId
    );

    if (existingIndex > -1 && cart[existingIndex]) {
      cart[existingIndex].quantity = Math.min(
        currentStock,
        cart[existingIndex].quantity + quantity
      );
    } else {
      cart.push({
        product: {
          id: product.id,
          title: product.title,
          price: currentPrice,
          coverUrl: activeImage || product.coverUrl,
          author: product.author,
          category: product.category,
        },
        variantId: selectedVariant?.id ?? null,
        variantTitle: selectedVariant?.title ?? null,
        quantity,
      });
    }

    localStorage.setItem("voyt_art_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));

    // Feedback
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/">Головна</Link>
        <ChevronRight size={14} />
        <Link href="/shop">Магазин</Link>
        <ChevronRight size={14} />
        <span className={styles.current}>{product.title}</span>
      </nav>

      {/* Main Product Layout */}
      <div className={styles.productLayout}>
        {/* Left: Gallery */}
        <div className={styles.galleryCol}>
          <div className={styles.mainImageWrap}>
            <Image
              src={getOptimizedImageUrl(activeImage, { preset: "large" })}
              alt={product.title}
              fill
              priority
              sizes="(max-width: 960px) 100vw, 50vw"
              className={styles.mainImage}
            />
          </div>

          {visibleImages.length > 1 && (
            <div className={styles.thumbsList}>
              {visibleImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleThumbnailClick(img)}
                  className={`${styles.thumbBtn} ${
                    activeImage === img.url ? styles.thumbBtnActive : ""
                  }`}
                >
                  <Image src={getOptimizedImageUrl(img.url, { preset: "thumb" })} alt="" fill sizes="72px" style={{ objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Purchase */}
        <div className={styles.detailsCol}>
          <div className={styles.headerInfo}>
            <span className={styles.categoryBadge}>{product.category.name}</span>
            <h1 className={styles.title}>{product.title}</h1>
            <div className={styles.priceRow}>
              <span className={styles.price}>
                {currentPrice.toLocaleString("uk-UA")} €
              </span>
            </div>
          </div>

          {/* Variant Selector */}
          {hasVariants && (
            <div className={styles.variantSection}>
              <span className={styles.sectionLabel}>Оберіть розмір / модифікацію:</span>
              <div className={styles.variantChips}>
                {product.variants.map((v) => {
                  const active = selectedVariant?.id === v.id;
                  const outOfStock = v.stock <= 0;
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
                      <span>{v.title}</span>
                      {v.price && v.price !== product.price && (
                        <span style={{ fontSize: "0.8rem", marginLeft: "0.35rem", opacity: 0.85 }}>
                          ({v.price.toLocaleString("uk-UA")} €)
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
              <span className={styles.stockOut}>✕ Немає в наявності</span>
            ) : (
              <span className={styles.stockIn}>
                ● В наявності ({currentStock} шт)
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
              >
                −
              </button>
              <span className={styles.qtyVal}>{quantity}</span>
              <button
                type="button"
                className={styles.qtyBtn}
                onClick={() => setQuantity((q) => Math.min(currentStock, q + 1))}
                disabled={quantity >= currentStock || isOutOfStock}
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
                  <span>Додано в кошик!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>Додати в кошик</span>
                </>
              )}
            </button>
          </div>

          {/* Description */}
          {product.description && (
            <div className={styles.descriptionBox}>
              <h3>Опис товару</h3>
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </div>
          )}

          {/* Author info card */}
          {product.author && (
            <Link href={`/art`} className={styles.authorCard}>
              <div className={styles.authorMeta}>
                {product.author.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getOptimizedImageUrl(product.author.photoUrl, { preset: "thumb" })}
                    alt={product.author.firstName}
                    className={styles.authorAvatar}
                  />
                ) : (
                  <div
                    className={styles.authorAvatar}
                    style={{ background: "#0f172a", color: "#d7ff01", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}
                  >
                    {product.author.firstName[0]}
                  </div>
                )}
                <div>
                  <h4 className={styles.authorName}>
                    {product.author.firstName} {product.author.lastName}
                  </h4>
                  <p className={styles.authorSubtitle}>
                    {product.author.shortDesc ?? "Художник галереї VoytArt"}
                  </p>
                </div>
              </div>
              <ArrowRight size={18} color="#64748b" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
