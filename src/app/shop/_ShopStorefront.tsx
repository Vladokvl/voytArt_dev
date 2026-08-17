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

type ProductImage = { id: number; url: string; order: number };
type ProductVariant = { id: number; title: string; price: number | null; stock: number };
type Author = { id: number; firstName: string; lastName: string };
type Category = { id: number; name: string; slug: string };

export type Product = {
  id: number;
  title: string;
  description: string | null;
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

    // If product has variants, navigate to the detail page to choose size/variant
    if (product.variants && product.variants.length > 0) {
      router.push(`/shop/${product.id}`);
      return;
    }

    addToCart({
      product: {
        id: product.id,
        title: product.title,
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
          <span>Curated Editions & Apparel</span>
        </div>
        <h1 className={styles.shopTitle}>Gallery Store</h1>
        <p className={styles.shopSub}>
          Original prints, limited apparel, and collectible design objects crafted by Ukrainian contemporary artists.
        </p>
      </section>

      {/* ── Featured Drops Carousel (if any) ── */}
      {featuredProducts.length > 0 && !selectedCategory && (
        <section className={styles.featuredSection}>
          <ProductCarousel
            title="Featured Releases"
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
            All Collections ({productsList.length})
          </button>
          {categoriesList.map((cat) => {
            const count = productsList.filter((p) => p.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                className={`${styles.catButton} ${selectedCategory === cat.id ? styles.catButtonActive : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name} {count > 0 ? `(${count})` : ""}
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
          <span>Cart</span>
          {totalItems > 0 && <span className={styles.cartCountBadge}>{totalItems}</span>}
        </button>
      </nav>

      {/* ── Products Grid ── */}
      <main className={styles.gridSection}>
        {filteredProducts.length === 0 ? (
          <div className={styles.empty}>
            <p>No products available in this category at the moment.</p>
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

              return (
                <article key={product.id} className={styles.productCard}>
                  <div className={styles.imageWrapper}>
                    <Link href={`/shop/${product.id}`} className={styles.imageLink}>
                      <Image
                        src={coverImg}
                        alt={product.title}
                        fill
                        priority={index < 4}
                        className={styles.productImage}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
                      />
                    </Link>

                    {isOutOfStock ? (
                      <span className={styles.soldOut}>Sold Out</span>
                    ) : product.isFeatured ? (
                      <span className={styles.featuredBadge}>Featured</span>
                    ) : null}
                  </div>

                  <div className={styles.cardInfo}>
                    <span className={styles.authorName}>
                      {product.author
                        ? `${product.author.firstName} ${product.author.lastName}`
                        : "VoytArt Gallery"}
                    </span>

                    <Link href={`/shop/${product.id}`} className={styles.titleLink}>
                      <h2 className={styles.productTitle}>{product.title}</h2>
                    </Link>

                    <div className={styles.cardFooter}>
                      <div className={styles.priceWrap}>
                        <span className={styles.price}>
                          {product.price.toLocaleString("en-US")} €
                        </span>
                        {product.variants && product.variants.length > 0 && (
                          <span className={styles.variantCountNote}>
                            {product.variants.length} options
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleProductAdd(product)}
                        disabled={isOutOfStock}
                        className={`${styles.addToCartBtn} ${isAdded ? styles.addedSuccess : ""}`}
                        aria-label={`Add ${product.title} to cart`}
                      >
                        {isOutOfStock ? (
                          "Sold Out"
                        ) : isAdded ? (
                          <>
                            <Check size={14} />
                            <span>Added</span>
                          </>
                        ) : product.variants && product.variants.length > 0 ? (
                          <>
                            <span>Options</span>
                            <ArrowRight size={14} />
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} />
                            <span>Add</span>
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
