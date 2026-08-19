"use client";

import { useState, useTransition, useEffect } from "react";
import Image from "next/image";
import { X, ShoppingBag, Trash2, ArrowRight, ArrowLeft, Check, Truck, Loader2 } from "lucide-react";
import { useCart } from "~/context/CartContext";
import { getOptimizedImageUrl } from "~/lib/cloudinary-optimize";
import { createOrderAction } from "~/app/shop/_actions/checkout";
import styles from "./CartDrawer.module.scss";

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

  // ── Блокування фонового скролу сторінки (iOS Safari + Android + Desktop) ──
  useEffect(() => {
    if (!isCartOpen) return;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
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
        console.error("Order error:", err);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    });
  };

  const handleCloseAndReset = () => {
    closeCart();
    if (step === "success") {
      setStep("cart");
      setOrderNumber("");
      setFormData({ name: "", email: "", phone: "", city: "", address: "", comment: "" });
    }
  };

  return (
    <div className={styles.drawerShell} data-open={isCartOpen}>
      <div
        className={styles.overlay}
        onClick={handleCloseAndReset}
        onTouchMove={(e) => e.preventDefault()}
      />

      <aside className={styles.drawer} aria-modal="true" role="dialog" aria-label="Shopping Cart">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitleWrap}>
            <ShoppingBag size={20} color="#0f172a" />
            <h2 className={styles.title}>
              {step === "cart" && "Shopping Cart"}
              {step === "form" && "Checkout & Shipping"}
              {step === "success" && "Order Received"}
            </h2>
            {step === "cart" && totalItems > 0 && (
              <span className={styles.itemCountBadge}>{totalItems}</span>
            )}
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={handleCloseAndReset}
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── STEP 1: CART ITEMS ── */}
        {step === "cart" && (
          <>
            {cart.length === 0 ? (
              <div className={styles.emptyCart}>
                <div className={styles.emptyIconWrap}>
                  <ShoppingBag size={32} />
                </div>
                <h3 className={styles.emptyTitle}>Your cart is empty</h3>
                <p className={styles.emptyText}>
                  Explore authentic prints, apparel, and merchandise created by Ukrainian artists.
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className={styles.exploreBtn}
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <>
                <div className={styles.content}>
                  <div className={styles.itemsList}>
                    {cart.map((item, idx) => (
                      <div key={`${item.product.id}_${item.variantId}_${idx}`} className={styles.itemCard}>
                        <div className={styles.itemThumb}>
                          <Image
                            src={
                              item.product.coverUrl
                                ? getOptimizedImageUrl(item.product.coverUrl, { preset: "thumb" })
                                : "/voyt.svg"
                            }
                            alt={item.product.title}
                            fill
                            className={styles.thumbImg}
                          />
                        </div>

                        <div className={styles.itemDetails}>
                          <span className={styles.itemAuthor}>
                            {item.product.author
                              ? `${item.product.author.firstName} ${item.product.author.lastName}`
                              : "VoytArt Gallery"}
                          </span>
                          <h4 className={styles.itemTitle}>{item.product.title}</h4>

                          {item.variantTitle && (
                            <span className={styles.variantTag}>
                              Option: {item.variantTitle}
                            </span>
                          )}

                          <span className={styles.itemPrice}>
                            {(item.product.price * item.quantity).toLocaleString("en-US")} €
                          </span>

                          <div className={styles.qtyActions}>
                            <div className={styles.qtyControl}>
                              <button
                                type="button"
                                className={styles.qtyBtn}
                                onClick={() => updateQuantity(idx, -1)}
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className={styles.qtyVal}>{item.quantity}</span>
                              <button
                                type="button"
                                className={styles.qtyBtn}
                                onClick={() => updateQuantity(idx, 1)}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className={styles.itemRemoveBtn}
                          onClick={() => removeFromCart(idx)}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.footer}>
                  <div className={styles.totalsRow}>
                    <span className={styles.totalLabel}>Subtotal</span>
                    <span className={styles.totalPrice}>{totalPrice.toLocaleString("en-US")} €</span>
                  </div>
                  <div className={styles.shippingNote}>
                    <Truck size={14} />
                    <span>Shipping via Nova Poshta across Ukraine & worldwide</span>
                  </div>
                  <button
                    type="button"
                    className={styles.checkoutPrimaryBtn}
                    onClick={handleProceedToCheckout}
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* ── STEP 2: CHECKOUT FORM ── */}
        {step === "form" && (
          <form onSubmit={handleSubmitOrder} className={styles.formContainer}>
            <div className={styles.formHeader}>
              <h3 className={styles.formTitle}>Shipping & Contact Details</h3>
              <p className={styles.formSub}>
                Please fill in your delivery details to complete your order.
              </p>
            </div>

            {errorMessage && <div className={styles.errorBox}>{errorMessage}</div>}

            <div className={styles.content} style={{ paddingRight: "0.25rem" }}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="cart_name">
                  Full Name *
                </label>
                <input
                  id="cart_name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Olena Kovalenko"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="cart_phone">
                  Phone Number *
                </label>
                <input
                  id="cart_phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+380 99 123 4567"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="cart_email">
                  Email Address *
                </label>
                <input
                  id="cart_email"
                  name="email"
                  type="email"
                  required
                  placeholder="olena@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="cart_city">
                  City (Nova Poshta) *
                </label>
                <input
                  id="cart_city"
                  name="city"
                  type="text"
                  required
                  placeholder="e.g. Kyiv, Lviv, Odesa"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="cart_address">
                  Nova Poshta Branch / Address *
                </label>
                <input
                  id="cart_address"
                  name="address"
                  type="text"
                  required
                  placeholder="Branch #12 or courier address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="cart_comment">
                  Order Notes (Optional)
                </label>
                <textarea
                  id="cart_comment"
                  name="comment"
                  placeholder="Any special requests or packaging notes..."
                  value={formData.comment}
                  onChange={handleInputChange}
                  className={styles.textarea}
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => setStep("cart")}
                disabled={isPending}
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Order ({totalPrice.toLocaleString("en-US")} €)</span>
                    <Check size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 3: ORDER SUCCESS ── */}
        {step === "success" && (
          <div className={styles.stateScreen}>
            <div className={styles.successIcon}>
              <Check size={32} />
            </div>
            <h3 className={styles.emptyTitle}>Order Successfully Placed!</h3>
            <p className={styles.emptyText}>
              Thank you for supporting Ukrainian art. We have received your order and will contact you shortly to confirm shipping.
            </p>
            <div className={styles.orderNumBox}>
              Order #{orderNumber}
            </div>
            <button
              type="button"
              onClick={handleCloseAndReset}
              className={styles.exploreBtn}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
