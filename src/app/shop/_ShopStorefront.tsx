"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight, Sparkles, Check } from "lucide-react";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import { useCart } from "~/context/CartContext";
import ProductCarousel from "~/components/shop/ProductCarousel";
import styles from "./shop.module.scss";
import { useTranslation } from "~/context/LanguageContext";
import { getLocalized } from "~/lib/i18n";

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

export default function ShopStorefront({
  initialProducts = [],
  categories = [],
}: {
  initialProducts?: Product[];
  categories?: Category[];
}) {
  const router = useRouter();
  const { addToCart, openCart, totalItems } = useCart();
  const { t, locale, getLocalizedHref } = useTranslation();

  const productsList = Array.isArray(initialProducts) ? initialProducts : [];
  const categoriesList = Array.isArray(categories) ? categories : [];

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [addedItemAnimationId, setAddedItemAnimationId] = useState<number | null>(null);

  const filteredProducts = selectedCategory
    ? productsList.filter((p) => p.categoryId === selectedCategory)
    : productsList;

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
      {featuredProducts.length > 0 && !selectedCategory && (
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
            onClick={() => setSelectedCategory(null)}
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
                onClick={() => setSelectedCategory(cat.id)}
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
          <div className={styles.productGrid}>
            {filteredProducts.map((product, index) => {
              const rawUrl = product.coverUrl ?? product.images?.[0]?.url;
              const coverImg = rawUrl
                ? getOptimizedImageUrl(rawUrl, { preset: "card" })
                : "/voyt.svg";

              const isOutOfStock = product.stock <= 0;
              const isAdded = addedItemAnimationId === product.id;
              const localizedTitle = getLocalized(product, "title", locale);
              const authorFirstName = product.author ? getLocalized(product.author, "firstName", locale) : "";
              const authorLastName = product.author ? getLocalized(product.author, "lastName", locale) : "";
              const authorFullName = product.author ? `${authorFirstName} ${authorLastName}`.trim() : "VoytArt Gallery";

              return (
                <article key={product.id} className={styles.productCard}>
                  <div className={styles.imageWrapper}>
                    <Link href={getLocalizedHref(`/shop/${product.id}`)} className={styles.imageLink}>
                      <Image
                        src={coverImg}
                        alt={localizedTitle}
                        fill
                        priority={index < 4}
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
                    <span className={styles.authorName}>
                      {authorFullName}
                    </span>

                    <Link href={getLocalizedHref(`/shop/${product.id}`)} className={styles.titleLink}>
                      <h2 className={styles.productTitle}>{localizedTitle}</h2>
                    </Link>

                    <div className={styles.cardFooter}>
                      <div className={styles.priceWrap}>
                        <span className={styles.price}>
                          {product.price.toLocaleString("en-US")} €
                        </span>
                        {product.variants && product.variants.length > 0 && (
                          <span className={styles.variantCountNote}>
                            {t("shop.optionsCount", { count: product.variants.length })}
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleProductAdd(product)}
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
            })}
          </div>
        )}
      </main>
    </div>
  );
}
