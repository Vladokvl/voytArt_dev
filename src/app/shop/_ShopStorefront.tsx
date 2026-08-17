"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";

import styles from "./shop.module.scss";
import ProductCarousel from "~/components/shop/ProductCarousel";
import { createOrderAction } from "./_actions/checkout";

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

type CartItem = {
  product: {
    id: number;
    title: string;
    price: number;
    coverUrl: string;
    author: Author;
    category?: Category;
  };
  variantId?: number | null;
  variantTitle?: string | null;
  quantity: number;
};

export default function ShopStorefront({
  initialProducts = [],
  categories = [],
}: {
  initialProducts?: Product[];
  categories?: Category[];
}) {
  const router = useRouter();
  const productsList = Array.isArray(initialProducts) ? initialProducts : [];
  const categoriesList = Array.isArray(categories) ? categories : [];

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkout Form State
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form" | "loading" | "success" | "error">("cart");
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    comment: "",
  });

  const loadCart = () => {
    const savedCart = localStorage.getItem("voyt_art_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart) as CartItem[]);
      } catch (e) {
        console.error("Failed to parse cart:", e);
      }
    } else {
      setCart([]);
    }
  };

  // Load cart from localStorage on mount & listen to cart updates
  useEffect(() => {
    loadCart();

    const handleCartSync = () => {
      loadCart();
      setIsCartOpen(true);
    };

    window.addEventListener("cartUpdated", handleCartSync);
    return () => window.removeEventListener("cartUpdated", handleCartSync);
  }, []);

  // Save cart to localStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("voyt_art_cart", JSON.stringify(newCart));
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;

    // If product has variants, direct to product page
    if (product.variants && product.variants.length > 0) {
      router.push(`/shop/${product.id}`);
      return;
    }

    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && !item.variantId
    );

    let newCart: CartItem[];
    if (existingIndex > -1) {
      newCart = cart.map((item, idx) =>
        idx === existingIndex
          ? { ...item, quantity: Math.min(product.stock, item.quantity + 1) }
          : item
      );
    } else {
      newCart = [
        ...cart,
        {
          product: {
            id: product.id,
            title: product.title,
            price: product.price,
            coverUrl: product.coverUrl,
            author: product.author,
          },
          variantId: null,
          variantTitle: null,
          quantity: 1,
        },
      ];
    }
    saveCart(newCart);
    setIsCartOpen(true);
  };

  const updateQuantity = (index: number, delta: number) => {
    const newCart = cart
      .map((item, idx) => {
        if (idx === index) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter(Boolean) as CartItem[];
    saveCart(newCart);
  };

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, idx) => idx !== index);
    saveCart(newCart);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.city || !formData.address) return;

    setCheckoutStep("loading");
    setErrorMessage("");

    const res = await createOrderAction({
      customerName: formData.name,
      customerPhone: formData.phone,
      customerEmail: formData.email,
      deliveryCity: formData.city,
      deliveryAddress: formData.address,
      comment: formData.comment,
      items: cart.map((item) => ({
        productId: item.product.id,
        variantId: item.variantId ?? null,
        title: item.product.title,
        variantTitle: item.variantTitle ?? null,
        price: item.product.price,
        quantity: item.quantity,
      })),
    });

    if (res.success && res.orderNumber) {
      setOrderNumber(res.orderNumber);
      setCheckoutStep("success");
      localStorage.removeItem("voyt_art_cart");
      setCart([]);
    } else {
      setErrorMessage(res.error ?? "Не вдалося оформити замовлення");
      setCheckoutStep("error");
    }
  };

  const filteredProducts = selectedCategory
    ? productsList.filter((p) => p.categoryId === selectedCategory)
    : productsList;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className={styles.shopWrapper}>
      {/* ── Shop Header ────────────────────────────────────── */}
      <section className={styles.shopHero}>
        <div className={styles.heroInner}>
          <h1 className={styles.shopTitle}>Арт-Магазин</h1>
          <p className={styles.shopSub}>Оригінальний мерч, ексклюзивні принти та сувеніри від художників VoytArt</p>
        </div>
      </section>

      {/* ── Featured Products Carousel ──────────────────────── */}
      <ProductCarousel 
        title="Рекомендовані товари" 
        products={productsList.filter((p) => p.isFeatured)} 
        onAddToCart={addToCart} 
      />

      {/* ── Shop Navigation & Cart Trigger ──────────────────── */}
      <div className={styles.shopNav}>
        <div className={styles.categories}>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`${styles.catButton} ${selectedCategory === null ? styles.catButtonActive : ""}`}
          >
            Усі товари
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`${styles.catButton} ${selectedCategory === cat.id ? styles.catButtonActive : ""}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setCheckoutStep("cart");
            setIsCartOpen(true);
          }}
          className={styles.cartTrigger}
          aria-label="Відкрити кошик"
        >
          Кошик ({totalItems})
        </button>
      </div>

      {/* ── Products Grid ───────────────────────────────────── */}
      <section className={styles.gridSection}>
        {filteredProducts.length === 0 ? (
          <p className={styles.empty}>У цій категорії поки що немає товарів.</p>
        ) : (
          <div className={styles.productGrid}>
            {filteredProducts.map((product, idx) => {
              const rawUrl = product.coverUrl ?? product.images[0]?.url;
              const coverImg = rawUrl ? getOptimizedImageUrl(rawUrl, { preset: "card" }) : "/voyt.svg";
              const hasMultiplePrices =
                product.variants?.some((v) => v.price && v.price !== product.price);

              return (
                <div
                  key={product.id}
                  className={styles.productCard}
                >
                  <Link href={`/shop/${product.id}`} className={styles.imageWrapper}>
                    <Image
                      src={coverImg}
                      alt={product.title}
                      fill
                      priority={idx < 2}
                      className={styles.productImage}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {product.stock <= 0 && (
                      <div className={styles.soldOut}>Немає в наявності</div>
                    )}
                  </Link>

                  <div className={styles.cardInfo}>
                    <p className={styles.authorName}>
                      {product.author ? `${product.author.firstName} ${product.author.lastName}` : ""}
                    </p>
                    <Link href={`/shop/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <h3 className={styles.productTitle}>
                        {product.title}
                      </h3>
                    </Link>
                    <div className={styles.cardFooter}>
                      <span className={styles.price}>
                        {hasMultiplePrices ? `від ` : ""}
                        {product.price.toLocaleString("uk-UA")} €
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className={styles.addToCartBtn}
                      >
                        {product.variants && product.variants.length > 0 ? "Обрати" : "Купити"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Sliding Cart Drawer ──────────────────────────────── */}
      <div className={styles.drawerShell} data-open={isCartOpen}>
        <div className={styles.drawerOverlay} onClick={() => setIsCartOpen(false)} />
        <div className={styles.cartDrawer}>
          <div className={styles.drawerHeader}>
            <h2>Ваш кошик</h2>
            <button onClick={() => setIsCartOpen(false)} className={styles.drawerClose}>
              ✕
            </button>
          </div>

          {checkoutStep === "cart" && (
            <div className={styles.drawerContent}>
              {cart.length === 0 ? (
                <div className={styles.emptyCart}>
                  <p>Кошик порожній</p>
                  <button onClick={() => setIsCartOpen(false)} className={styles.continueShopping}>
                    Продовжити покупки
                  </button>
                </div>
              ) : (
                <>
                  <div className={styles.cartItems}>
                    {cart.map((item, idx) => (
                      <div key={`${item.product.id}_${item.variantId}_${idx}`} className={styles.cartItem}>
                        <div className={styles.itemThumb}>
                          <Image
                            src={item.product.coverUrl ? getOptimizedImageUrl(item.product.coverUrl, { preset: "thumb" }) : "/voyt.svg"}
                            alt={item.product.title}
                            fill
                          />
                        </div>
                        <div className={styles.itemDetails}>
                          <h4>{item.product.title}</h4>
                          {item.variantTitle && (
                            <span style={{ fontSize: "0.78rem", color: "#7c3aed", fontWeight: 600 }}>
                              {item.variantTitle}
                            </span>
                          )}
                          <span className={styles.itemPrice}>
                            {item.product.price.toLocaleString("uk-UA")} €
                          </span>
                          <div className={styles.qtyControl}>
                            <button onClick={() => updateQuantity(idx, -1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(idx, 1)}>+</button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(idx)}
                          className={styles.itemRemove}
                          title="Видалити з кошика"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className={styles.drawerFooter}>
                    <div className={styles.totals}>
                      <span>Разом до сплати</span>
                      <span>{totalPrice.toLocaleString("uk-UA")} €</span>
                    </div>
                    <button
                      onClick={() => setCheckoutStep("form")}
                      className={styles.checkoutBtn}
                    >
                      Оформити замовлення
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {checkoutStep === "form" && (
            <div className={styles.drawerContent}>
              <form onSubmit={handleCheckoutSubmit} className={styles.checkoutForm}>
                <h3>Доставка Новою Поштою</h3>

                <div className={styles.formField}>
                  <label>Прізвище та імʼя одержувача *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Шевченко Тарас"
                  />
                </div>

                <div className={styles.formField}>
                  <label>Номер телефону *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+380 50 123 4567"
                  />
                </div>

                <div className={styles.formField}>
                  <label>Email адреса</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="taras@example.com"
                  />
                </div>

                <div className={styles.formField}>
                  <label>Місто доставки *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="Київ / Львів / Одеса"
                  />
                </div>

                <div className={styles.formField}>
                  <label>Відділення або Поштомат Нової Пошти *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Відділення №12 (вул. Хрещатик, 1)"
                  />
                </div>

                <div className={styles.formField}>
                  <label>Коментар (опціонально)</label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    placeholder="Побажання щодо пакування тощо"
                  />
                </div>

                <div className={styles.formTotals}>
                  <span>Сума замовлення</span>
                  <span>{totalPrice.toLocaleString("uk-UA")} €</span>
                </div>

                <div className={styles.formButtons}>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep("cart")}
                    className={styles.backBtn}
                  >
                    Назад
                  </button>
                  <button type="submit" className={styles.submitOrderBtn}>
                    Підтвердити замовлення
                  </button>
                </div>
              </form>
            </div>
          )}

          {checkoutStep === "loading" && (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Оформлюємо замовлення...</p>
            </div>
          )}

          {checkoutStep === "error" && (
            <div className={styles.successState}>
              <span className={styles.successIcon} style={{ background: "#ef4444", color: "#fff" }}>!</span>
              <h3>Помилка</h3>
              <p>{errorMessage}</p>
              <button
                onClick={() => setCheckoutStep("form")}
                className={styles.closeSuccessBtn}
              >
                Спробувати знову
              </button>
            </div>
          )}

          {checkoutStep === "success" && (
            <div className={styles.successState}>
              <span className={styles.successIcon}>✓</span>
              <h3>Замовлення #{orderNumber} прийнято!</h3>
              <p>Дякуємо за покупку! Наш менеджер незабаром звʼяжеться з вами за номером <strong>{formData.phone}</strong> для підтвердження відправки Новою Поштою.</p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCheckoutStep("cart");
                }}
                className={styles.closeSuccessBtn}
              >
                Закрити
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
