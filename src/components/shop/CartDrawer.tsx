"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import { X, ShoppingBag, Trash2, ArrowRight, ArrowLeft, Check, Truck, Loader2 } from "lucide-react";
import { useCart } from "~/context/CartContext";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import { createOrderAction } from "~/app/(site)/[locale]/shop/_actions/checkout";
import styles from "./CartDrawer.module.scss";
import { useTranslation } from "~/context/LanguageContext";

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();
  const { t } = useTranslation();

  // ── Блокування фонового скролу (iOS Safari + Android + Desktop) ──────────
  // iOS Safari ігнорує overflow:hidden на body, тому використовуємо position:fixed
  useEffect(() => {
    if (!isCartOpen) return;

    const scrollY = window.scrollY;

    // Зберігаємо поточний стан
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;
    const prevOverflow = document.body.style.overflow;
    const prevTouchAction = document.body.style.touchAction;

    // Блокуємо скрол — трюк для iOS Safari
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    document.documentElement.style.overflow = "hidden";

    return () => {
      // Відновлюємо стан і повертаємо позицію скролу
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      document.body.style.overflow = prevOverflow;
      document.body.style.touchAction = prevTouchAction;
      document.documentElement.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [isCartOpen]);


  const [step, setStep] = useState<"cart" | "form" | "success">("cart");
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    comment: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceedToCheckout = () => {
    setErrorMessage("");
    setStep("form");
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setErrorMessage("");

    startTransition(async () => {
      try {
        const orderData = {
          customerName: formData.name.trim(),
          customerEmail: formData.email.trim(),
          customerPhone: formData.phone.trim(),
          deliveryCity: formData.city.trim(),
          deliveryAddress: formData.address.trim(),
          comment: formData.comment.trim() || undefined,
          totalAmount: totalPrice,
          items: cart.map((item) => ({
            productId: item.product.id,
            variantId: item.variantId ?? undefined,
            title: item.product.title,
            variantTitle: item.variantTitle ?? undefined,
            price: item.product.price,
            quantity: item.quantity,
          })),
        };

        const result = await createOrderAction(orderData);

        if (result.success && result.orderNumber) {
          setOrderNumber(result.orderNumber);
          clearCart();
          setStep("success");
        } else {
          setErrorMessage(result.error ?? "Failed to place order. Please try again.");
        }
      } catch (err) {
        console.error("Order submission failed:", err);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    });
  };

  const handleModalClose = () => {
    closeCart();
    if (step === "success") {
      setTimeout(() => {
        setStep("cart");
        setOrderNumber("");
        setFormData({ name: "", email: "", phone: "", city: "", address: "", comment: "" });
      }, 300);
    }
  };



  return (
    <div className={styles.drawerOverlay} data-open={isCartOpen} onClick={handleModalClose}>
      <div
        className={styles.drawerPanel}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
      >
        {/* ── Header ── */}

        <header className={styles.header}>
          <div className={styles.headerLeft}>
            {step === "form" && (
              <button
                type="button"
                onClick={() => setStep("cart")}
                className={styles.backBtn}
                aria-label="Back to Cart"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className={styles.title}>
              {step === "cart" && `${t("cart.shoppingCart")} (${totalItems})`}
              {step === "form" && t("cart.deliveryDetails")}
              {step === "success" && t("cart.orderConfirmed")}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleModalClose}
            className={styles.closeBtn}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </header>

        {/* ── Body Views ── */}
        <div className={styles.body}>
          {/* 1. CART ITEMS VIEW */}
          {step === "cart" && (
            <>
              {cart.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIconWrap}>
                    <ShoppingBag size={48} strokeWidth={1.2} />
                  </div>
                  <h3>{t("cart.emptyCart")}</h3>
                  <p>{t("cart.exploreShop")}</p>
                  <button
                    type="button"
                    onClick={handleModalClose}
                    className={styles.continueBtn}
                  >
                    {t("cart.exploreShop")}
                  </button>
                </div>
              ) : (
                <div className={styles.itemsList}>
                  {cart.map((item, index) => {
                    const itemKey = `${item.product.id}-${item.variantId ?? "base"}`;
                    const itemPrice = item.product.price;

                    return (
                      <div key={itemKey} className={styles.itemCard}>
                        <div className={styles.itemThumb}>
                          {item.product.coverUrl ? (
                            <Image
                              src={getOptimizedImageUrl(item.product.coverUrl, { preset: "thumb" })}
                              alt={item.product.title}
                              fill
                              className={styles.thumbImg}
                            />
                          ) : (
                            <div className={styles.itemPlaceholder}>🖼</div>
                          )}
                        </div>

                        <div className={styles.itemDetails}>
                          <div>
                            <h4 className={styles.itemTitle}>{item.product.title}</h4>
                            <button
                              type="button"
                              onClick={() => removeFromCart(index)}
                              className={styles.itemRemoveBtn}
                              aria-label="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {item.variantTitle && (
                            <span className={styles.variantTag}>
                              {item.variantTitle}
                            </span>
                          )}

                          <div className={styles.qtyActions}>
                            <div className={styles.qtyControl}>
                              <button
                                type="button"
                                onClick={() => updateQuantity(index, -1)}
                                className={styles.qtyBtn}
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className={styles.qtyVal}>{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(index, 1)}
                                className={styles.qtyBtn}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>

                            <div className={styles.itemPrice}>
                              {(itemPrice * item.quantity).toLocaleString("en-US")} €
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* 2. CHECKOUT FORM VIEW */}
          {step === "form" && (
            <form id="checkout-form" onSubmit={handleSubmitOrder} className={styles.checkoutForm}>
              {errorMessage && (
                <div className={styles.errorAlert} role="alert">
                  {errorMessage}
                </div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="checkout-name">{t("cart.yourName")} *</label>
                <input
                  id="checkout-name"
                  name="name"
                  type="text"
                  required
                  placeholder="Alex Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="checkout-phone">{t("cart.phone")} *</label>
                  <input
                    id="checkout-phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+380..."
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="checkout-email">{t("cart.email")} *</label>
                  <input
                    id="checkout-email"
                    name="email"
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="checkout-city">{t("cart.city")} *</label>
                <input
                  id="checkout-city"
                  name="city"
                  type="text"
                  required
                  placeholder="Kyiv"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="checkout-address">{t("cart.address")} *</label>
                <input
                  id="checkout-address"
                  name="address"
                  type="text"
                  required
                  placeholder="Nova Poshta Branch №1"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="checkout-comment">{t("cart.comment")}</label>
                <textarea
                  id="checkout-comment"
                  name="comment"
                  rows={2}
                  placeholder="Special instructions or notes"
                  value={formData.comment}
                  onChange={handleInputChange}
                  className={styles.textarea}
                />
              </div>

              <div className={styles.deliveryNotice}>
                <Truck size={18} />
                <span>{t("cart.shippingCalculated")}</span>
              </div>
            </form>
          )}

          {/* 3. SUCCESS / CONFIRMATION VIEW */}
          {step === "success" && (
            <div className={styles.successView}>
              <div className={styles.successIcon}>
                <Check size={40} strokeWidth={2.5} />
              </div>
              <h3>{t("cart.orderConfirmed")}</h3>
              <p className={styles.orderNumberText}>
                {t("cart.orderNumber")}: <strong>{orderNumber}</strong>
              </p>
              <p className={styles.successMessage}>
                {t("cart.thankYou")}
              </p>
              <button
                type="button"
                onClick={handleModalClose}
                className={styles.primaryActionBtn}
              >
                {t("cart.continueShopping")}
              </button>
            </div>
          )}
        </div>

        {/* ── Footer / Actions ── */}
        {step !== "success" && cart.length > 0 && (
          <footer className={styles.footer}>
            <div className={styles.summaryRow}>
              <span className={styles.subtotalLabel}>{t("cart.subtotal")}</span>
              <span className={styles.subtotalValue}>{totalPrice.toLocaleString("en-US")} €</span>
            </div>

            {step === "cart" && (
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className={styles.primaryActionBtn}
              >
                <span>{t("cart.checkout")}</span>
                <ArrowRight size={18} />
              </button>
            )}

            {step === "form" && (
              <button
                type="submit"
                form="checkout-form"
                disabled={isPending}
                className={styles.primaryActionBtn}
              >
                {isPending ? (
                  <>
                    <Loader2 size={18} className={styles.spinner} />
                    <span>{t("cart.processing")}</span>
                  </>
                ) : (
                  <>
                    <span>{t("cart.placeOrder")}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            )}
          </footer>
        )}
      </div>
    </div>
  );
}
