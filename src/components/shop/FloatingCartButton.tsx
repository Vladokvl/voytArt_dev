"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "~/context/CartContext";
import styles from "./FloatingCartButton.module.scss";

export default function FloatingCartButton() {
  const { openCart, totalItems } = useCart();

  return (
    <button
      type="button"
      className={styles.floatingCartBtn}
      onClick={openCart}
      aria-label={`Open shopping cart (${totalItems} items)`}
    >
      <div className={styles.iconWrap}>
        <ShoppingBag size={19} color="#d7ff01" />
      </div>
      <span className={styles.label}>Cart</span>
      {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
    </button>
  );
}
