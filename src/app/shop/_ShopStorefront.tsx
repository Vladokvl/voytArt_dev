"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import * as Dialog from "@radix-ui/react-dialog";
import styles from "./shop.module.scss";

type ProductImage = { id: number; url: string; order: number };
type Author = { id: number; firstName: string; lastName: string };
type Category = { id: number; name: string; slug: string };

type Product = {
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
  images: ProductImage[];
};

type CartItem = {
  product: Product;
  quantity: number;
};

export default function ShopStorefront({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: Category[];
}) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Checkout Form State
  const [checkoutStep, setCheckoutStep] = useState<"cart" | "form" | "loading" | "success">("cart");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("voyt_art_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart) as CartItem[]);
      } catch (e) {
        console.error("Failed to parse cart:", e);
      }
    }
  }, []);

  // Save cart to localStorage
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("voyt_art_cart", JSON.stringify(newCart));
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;
    const existing = cart.find((item) => item.product.id === product.id);
    let newCart: CartItem[];
    if (existing) {
      newCart = cart.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: Math.min(product.stock, item.quantity + 1) }
          : item
      );
    } else {
      newCart = [...cart, { product, quantity: 1 }];
    }
    saveCart(newCart);
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: number, delta: number) => {
    const newCart = cart
      .map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return { ...item, quantity: Math.min(item.product.stock, newQty) };
        }
        return item;
      })
      .filter(Boolean) as CartItem[];
    saveCart(newCart);
  };

  const removeFromCart = (productId: number) => {
    const newCart = cart.filter((item) => item.product.id !== productId);
    saveCart(newCart);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address) return;

    setCheckoutStep("loading");
    // Simulate order placement
    setTimeout(() => {
      setCheckoutStep("success");
      localStorage.removeItem("voyt_art_cart");
      setCart([]);
    }, 2000);
  };

  const filteredProducts = selectedCategory
    ? initialProducts.filter((p) => p.categoryId === selectedCategory)
    : initialProducts;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className={styles.shopWrapper}>
      {/* ── Shop Header ────────────────────────────────────── */}
      <section className={styles.shopHero}>
        <div className={styles.heroInner}>
          <h1 className={styles.shopTitle}>Art Shop</h1>
          <p className={styles.shopSub}>Exquisite creations and art supplies curated for collectors</p>
        </div>
      </section>

      {/* ── Shop Navigation & Cart Trigger ──────────────────── */}
      <div className={styles.shopNav}>
        <div className={styles.categories}>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`${styles.catButton} ${selectedCategory === null ? styles.catButtonActive : ""}`}
          >
            All Products
          </button>
          {categories.map((cat) => (
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
          aria-label="Open cart"
        >
          Cart ({totalItems})
        </button>
      </div>

      {/* ── Products Grid ───────────────────────────────────── */}
      <section className={styles.gridSection}>
        {filteredProducts.length === 0 ? (
          <p className={styles.empty}>No products found in this category.</p>
        ) : (
          <div className={styles.productGrid}>
            {filteredProducts.map((product) => {
              const coverImg = product.images[0]?.url ?? "/voyt.svg";
              return (
                <div key={product.id} className={styles.productCard}>
                  <div
                    onClick={() => setSelectedProduct(product)}
                    className={styles.imageWrapper}
                  >
                    <Image
                      src={coverImg}
                      alt={product.title}
                      fill
                      className={styles.productImage}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {product.stock <= 0 && (
                      <div className={styles.soldOut}>Out of stock</div>
                    )}
                  </div>

                  <div className={styles.cardInfo}>
                    <p className={styles.authorName}>
                      {product.author.firstName} {product.author.lastName}
                    </p>
                    <h3 onClick={() => setSelectedProduct(product)} className={styles.productTitle}>
                      {product.title}
                    </h3>
                    <div className={styles.cardFooter}>
                      <span className={styles.price}>${product.price.toLocaleString()}</span>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock <= 0}
                        className={styles.addToCartBtn}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Product Details Modal ────────────────────────────── */}
      <Dialog.Root open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.overlay} />
          {selectedProduct && (
            <Dialog.Content className={styles.modal}>
              <div className={styles.modalGrid}>
                {/* Image Gallery */}
                <div className={styles.modalImages}>
                  <div className={styles.mainImageWrapper}>
                    <Image
                      src={selectedProduct.images[0]?.url ?? "/voyt.svg"}
                      alt={selectedProduct.title}
                      fill
                      className={styles.modalMainImg}
                    />
                  </div>
                </div>

                {/* Details Panel */}
                <div className={styles.modalDetails}>
                  <div>
                    <span className={styles.modalAuthor}>
                      {selectedProduct.author.firstName} {selectedProduct.author.lastName}
                    </span>
                    <Dialog.Title className={styles.modalTitle}>
                      {selectedProduct.title}
                    </Dialog.Title>
                    <span className={styles.modalPrice}>
                      ${selectedProduct.price.toLocaleString()}
                    </span>

                    {selectedProduct.description && (
                      <div
                        className={styles.modalDesc}
                        dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
                      />
                    )}

                    <div className={styles.stockStatus}>
                      {selectedProduct.stock > 0 ? (
                        <span className={styles.inStock}>In Stock ({selectedProduct.stock})</span>
                      ) : (
                        <span className={styles.outOfStock}>Out of stock</span>
                      )}
                    </div>
                  </div>

                  <div className={styles.modalActions}>
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                      }}
                      disabled={selectedProduct.stock <= 0}
                      className={styles.modalPrimaryBtn}
                    >
                      Add to Cart
                    </button>
                    <Dialog.Close className={styles.modalCloseBtn}>
                      Close
                    </Dialog.Close>
                  </div>
                </div>
              </div>
            </Dialog.Content>
          )}
        </Dialog.Portal>
      </Dialog.Root>

      {/* ── Sliding Cart Drawer ──────────────────────────────── */}
      <div className={styles.drawerShell} data-open={isCartOpen}>
        <div className={styles.drawerOverlay} onClick={() => setIsCartOpen(false)} />
        <div className={styles.cartDrawer}>
          <div className={styles.drawerHeader}>
            <h2>Your Cart</h2>
            <button onClick={() => setIsCartOpen(false)} className={styles.drawerClose}>
              ✕
            </button>
          </div>

          {checkoutStep === "cart" && (
            <div className={styles.drawerContent}>
              {cart.length === 0 ? (
                <div className={styles.emptyCart}>
                  <p>Your cart is empty</p>
                  <button onClick={() => setIsCartOpen(false)} className={styles.continueShopping}>
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className={styles.cartItems}>
                    {cart.map((item) => (
                      <div key={item.product.id} className={styles.cartItem}>
                        <div className={styles.itemThumb}>
                          <Image
                            src={item.product.images[0]?.url ?? "/voyt.svg"}
                            alt={item.product.title}
                            fill
                          />
                        </div>
                        <div className={styles.itemDetails}>
                          <h4>{item.product.title}</h4>
                          <span className={styles.itemPrice}>
                            ${item.product.price.toLocaleString()}
                          </span>
                          <div className={styles.qtyControl}>
                            <button onClick={() => updateQuantity(item.product.id, -1)}>-</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, 1)}>+</button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className={styles.itemRemove}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className={styles.drawerFooter}>
                    <div className={styles.totals}>
                      <span>Total</span>
                      <span>${totalPrice.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={() => setCheckoutStep("form")}
                      className={styles.checkoutBtn}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {checkoutStep === "form" && (
            <div className={styles.drawerContent}>
              <form onSubmit={handleCheckoutSubmit} className={styles.checkoutForm}>
                <h3>Delivery Details</h3>

                <div className={styles.formField}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div className={styles.formField}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>

                <div className={styles.formField}>
                  <label>Phone Number</label>
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
                  <label>Shipping Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="City, Street, House, Zip"
                  />
                </div>

                <div className={styles.formTotals}>
                  <span>Total Amount</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>

                <div className={styles.formButtons}>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep("cart")}
                    className={styles.backBtn}
                  >
                    Back
                  </button>
                  <button type="submit" className={styles.submitOrderBtn}>
                    Place Order (Simulate)
                  </button>
                </div>
              </form>
            </div>
          )}

          {checkoutStep === "loading" && (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>Processing your order...</p>
            </div>
          )}

          {checkoutStep === "success" && (
            <div className={styles.successState}>
              <span className={styles.successIcon}>✓</span>
              <h3>Order Placed!</h3>
              <p>Thank you for your purchase. We have sent a simulated confirmation email to <strong>{formData.email}</strong>.</p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setCheckoutStep("cart");
                }}
                className={styles.closeSuccessBtn}
              >
                Close Drawer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
