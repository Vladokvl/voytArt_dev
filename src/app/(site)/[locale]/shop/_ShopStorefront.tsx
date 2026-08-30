"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingBag, ArrowRight, Sparkles, Check } from "lucide-react";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import { useCart } from "~/context/CartContext";
import ProductCarousel from "~/components/shop/ProductCarousel";
import styles from "./shop.module.scss";
import { useTranslation } from "~/context/LanguageContext";
import { getLocalized, formatLocalizedPrice, type Locale } from "~/lib/i18n";

type ProductImage = { id: number; url: string; order: number };
type ProductVariant = { id: number; title: string; titleUk?: string | null; price: number | null; stock: number };
type Author = { id: number; firstName: string; firstNameUk?: string | null; lastName: string; lastNameUk?: string | null };
type Category = { id: number; name: string; nameUk?: string | null; slug: string };

export type Product = {
  id: number;
  title: string;
  titleUk?: string | null;
  description: string | null;
  descriptionUk?: string | null;
  price: number;
  stock: number;
  sortOrder: number;
  categoryId: number;
  authorId: number;
  author: Author;
  category: Category;
  coverUrl: string;
  isFeatured: boolean;
  images: ProductImage[];
  variants?: ProductVariant[];
};

const ProductCardItem = React.memo(function ProductCardItem({
  product,
  priority,
  isAdded,
  locale,
  getLocalizedHref,
  onAddToCart,
  t,
}: {
  product: Product;
  priority: boolean;
  isAdded: boolean;
  locale: Locale;
  getLocalizedHref: (path: string) => string;
  onAddToCart: (product: Product) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const rawUrl = product.coverUrl ?? product.images?.[0]?.url;
  const coverImg = rawUrl
    ? getOptimizedImageUrl(rawUrl, { preset: "card" })
    : "/voyt.svg";

  const isOutOfStock = product.stock <= 0;
  const localizedTitle = getLocalized(product, "title", locale);
  const authorFirstName = product.author ? getLocalized(product.author, "firstName", locale) : "";
  const authorLastName = product.author ? getLocalized(product.author, "lastName", locale) : "";
  const authorFullName = product.author ? `${authorFirstName} ${authorLastName}`.trim() : "VoytArt Gallery";

  return (
    <article className={styles.productCard}>
      <div className={styles.imageWrapper}>
        <Link href={getLocalizedHref(`/shop/${product.id}`)} className={styles.imageLink}>
          <Image
            src={coverImg}
            alt={localizedTitle}
            fill
            priority={priority}
            className={styles.productImage}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
          />
        </Link>

        {isOutOfStock ? (
          <span className={styles.soldOut}>{t("shop.soldOut")}</span>
        ) : product.isFeatured ? (
          <span className={styles.featuredBadge}>{t("shop.featured")}</span>
        ) : null}
      </div>

      <div className={styles.cardInfo}>
        <span className={styles.authorName}>{authorFullName}</span>

        <Link href={getLocalizedHref(`/shop/${product.id}`)} className={styles.titleLink}>
          <h2 className={styles.productTitle}>{localizedTitle}</h2>
        </Link>

        <div className={styles.cardFooter}>
          <div className={styles.priceWrap}>
            <span className={styles.price}>
              {formatLocalizedPrice(product.price, locale)}
            </span>
            {product.variants && product.variants.length > 0 && (
              <span className={styles.variantCountNote}>
                {t("shop.optionsCount", { count: product.variants.length })}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`${styles.addToCartBtn} ${isAdded ? styles.addedSuccess : ""}`}
            aria-label={`Add ${localizedTitle} to cart`}
          >
            {isOutOfStock ? (
              t("shop.soldOut")
            ) : isAdded ? (
              <>
                <Check size={14} />
                <span>{t("shop.added")}</span>
              </>
            ) : product.variants && product.variants.length > 0 ? (
              <>
                <span>{t("shop.options")}</span>
                <ArrowRight size={14} />
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>{t("shop.add")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
});

export default function ShopStorefront({
  initialProducts = [],
  categories = [],
}: {
  initialProducts?: Product[];
  categories?: Category[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart, openCart, totalItems } = useCart();
  const { t, locale, getLocalizedHref } = useTranslation();

  const productsList = useMemo(
    () => (Array.isArray(initialProducts) ? initialProducts : []),
    [initialProducts],
  );
  const categoriesList = useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories],
  );

  const PAGE_SIZE = 12;
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [addedItemAnimationId, setAddedItemAnimationId] = useState<number | null>(null);

  // Sync category filter with URL search param ?category=slug
  const categoryParam = searchParams.get("category");
  useEffect(() => {
    if (categoryParam) {
      const match = categoriesList.find(
        (c) => c.slug === categoryParam || String(c.id) === categoryParam,
      );
      if (match) {
        setSelectedCategory(match.id);
        setVisibleCount(PAGE_SIZE);
      }
    }
  }, [categoryParam, categoriesList]);

  const handleSelectCategory = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setVisibleCount(PAGE_SIZE);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (categoryId === null) {
        params.delete("category");
      } else {
        const cat = categoriesList.find((c) => c.id === categoryId);
        params.set("category", cat ? cat.slug : String(categoryId));
      }
      const qs = params.toString();
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${qs ? `?${qs}` : ""}`,
      );
    }
  };

  const filteredProducts = selectedCategory
    ? productsList.filter((p) => p.categoryId === selectedCategory)
    : productsList;

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const featuredProducts = productsList.filter((p) => p.isFeatured);

  const handleProductAdd = (product: Product) => {
    if (product.stock <= 0) return;

    if (product.variants && product.variants.length > 0) {
      router.push(getLocalizedHref(`/shop/${product.id}`));
      return;
    }

    addToCart({
      product: {
        id: product.id,
        title: getLocalized(product, "title", locale),
        price: product.price,
        coverUrl: product.coverUrl,
        author: product.author,
        category: product.category,
      },
      variantId: null,
      variantTitle: null,
      quantity: 1,
      maxStock: product.stock,
    });

    setAddedItemAnimationId(product.id);
    setTimeout(() => setAddedItemAnimationId(null), 1500);
  };

  return (
    <div className={styles.shopWrapper}>
      {/* ── Editorial Hero ── */}
      <section className={styles.shopHero}>
        <div className={styles.heroBadge}>
          <Sparkles size={14} />
          <span>{t("shop.curatedBadge")}</span>
        </div>
        <h1 className={styles.shopTitle}>{t("shop.storeTitle")}</h1>
        <p className={styles.shopSub}>
          {t("shop.storeSubtitle")}
        </p>
      </section>

      {/* ── Featured Drops Carousel (if any) ── */}
      {featuredProducts.length > 0 && (
        <section className={styles.featuredSection}>
          <ProductCarousel
            title={t("shop.featuredReleases")}
            products={featuredProducts}
            onAddToCart={handleProductAdd}
          />
        </section>
      )}

      {/* ── Category Filters & Navigation ── */}
      <nav className={styles.shopNav} aria-label="Product categories">
        <div className={styles.categories}>
          <button
            type="button"
            className={`${styles.catButton} ${selectedCategory === null ? styles.catButtonActive : ""}`}
            onClick={() => handleSelectCategory(null)}
          >
            {t("shop.allCollections", { count: productsList.length })}
          </button>
          {categoriesList.map((cat) => {
            const count = productsList.filter((p) => p.categoryId === cat.id).length;
            const localizedCatName = getLocalized(cat, "name", locale);
            return (
              <button
                key={cat.id}
                type="button"
                className={`${styles.catButton} ${selectedCategory === cat.id ? styles.catButtonActive : ""}`}
                onClick={() => handleSelectCategory(cat.id)}
              >
                {localizedCatName} {count > 0 ? `(${count})` : ""}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={openCart}
          className={styles.cartTrigger}
          aria-label={`Open shopping cart with ${totalItems} items`}
        >
          <ShoppingBag size={18} />
          <span>{t("shop.cart")}</span>
          {totalItems > 0 && <span className={styles.cartCountBadge}>{totalItems}</span>}
        </button>
      </nav>

      {/* ── Products Grid ── */}
      <main className={styles.gridSection}>
        {filteredProducts.length === 0 ? (
          <div className={styles.empty}>
            <p>{t("shop.noProducts")}</p>
          </div>
        ) : (
          <>
            <div className={styles.productGrid}>
              {visibleProducts.map((product, index) => (
                <ProductCardItem
                  key={product.id}
                  product={product}
                  priority={index < 4}
                  isAdded={addedItemAnimationId === product.id}
                  locale={locale}
                  getLocalizedHref={getLocalizedHref}
                  onAddToCart={handleProductAdd}
                  t={t}
                />
              ))}
            </div>

            {hasMore && (
              <div className={styles.loadMoreContainer}>
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className={styles.loadMoreBtn}
                >
                  {t("gallery.showMore")}
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
