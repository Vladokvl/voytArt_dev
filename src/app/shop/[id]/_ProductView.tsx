"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ShoppingBag, ArrowRight, Check } from "lucide-react";
import { useCart } from "~/context/CartContext";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import ProductCarousel from "~/components/shop/ProductCarousel";
import styles from "./product-page.module.scss";

type ProductImage = {
  id: number;
  url: string;
  order: number;
  variantId?: number | null;
};

type ProductVariant = {
  id: number;
  title: string;
  price: number | null;
  stock: number;
  sku?: string | null;
  sortOrder: number;
};

type Author = {
  id: number;
  firstName: string;
  lastName: string;
  photoUrl?: string | null;
  shortDesc?: string | null;
};

type Category = {
  id: number;
  name: string;
  slug: string;
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
  relatedProducts = [],
}: {
  product: FullProduct;
  relatedProducts?: FullProduct[];
}) {
  const { addToCart } = useCart();

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

  const [activeImage, setActiveImage] = useState(
    visibleImages[0]?.url ?? product.coverUrl,
  );

  // When variant changes, auto-switch active image to variant's photo if available
  const handleVariantSelect = (v: ProductVariant) => {
    setSelectedVariant(v);
    setQuantity(1);

    const variantPhoto = allImages.find((img) => img.variantId === v.id);
    if (variantPhoto) {
      setActiveImage(variantPhoto.url);
    }
  };

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

    addToCart({
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
      maxStock: currentStock,
    });

    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div className={styles.pageContainer}>
      {/* Breadcrumbs */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <ChevronRight size={14} />
        <Link href="/shop">Shop</Link>
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
                  aria-label={`View image ${i + 1}`}
                >
                  <Image
                    src={getOptimizedImageUrl(img.url, { preset: "thumb" })}
                    alt=""
                    fill
                    sizes="72px"
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
            <span className={styles.categoryBadge}>{product.category.name}</span>
            <h1 className={styles.title}>{product.title}</h1>
            <div className={styles.priceRow}>
              <span className={styles.price}>
                {currentPrice.toLocaleString("en-US")} €
              </span>
            </div>
          </div>

          {/* Variant Selector */}
          {hasVariants && (
            <div className={styles.variantSection}>
              <span className={styles.sectionLabel}>Select Option / Size:</span>
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
              <span className={styles.stockOut}>✕ Out of Stock</span>
            ) : (
              <span className={styles.stockIn}>
                ● In Stock ({currentStock} available)
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
                  <span>Added to Cart!</span>
                </>
              ) : isOutOfStock ? (
                <span>Sold Out</span>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>

          {/* Description */}
          {product.description && (
            <div className={styles.descriptionBox}>
              <h3>Product Details</h3>
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
                    style={{
                      background: "#0f172a",
                      color: "#d7ff01",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                    }}
                  >
                    {product.author.firstName[0]}
                  </div>
                )}
                <div>
                  <h4 className={styles.authorName}>
                    {product.author.firstName} {product.author.lastName}
                  </h4>
                  <p className={styles.authorSubtitle}>
                    {product.author.shortDesc ?? "VoytArt Gallery Artist"}
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
            title="You May Also Like"
            products={relatedProducts}
            onAddToCart={(relProduct) => {
              addToCart({
                product: {
                  id: relProduct.id,
                  title: relProduct.title,
                  price: relProduct.price,
                  coverUrl: relProduct.coverUrl ?? "",
                  author: relProduct.author
                    ? {
                        id: relProduct.author.id,
                        firstName: relProduct.author.firstName,
                        lastName: relProduct.author.lastName,
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
