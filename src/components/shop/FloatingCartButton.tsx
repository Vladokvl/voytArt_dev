"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "~/context/CartContext";
import styles from "./FloatingCartButton.module.scss";
import { useTranslation } from "~/context/LanguageContext";

export default function FloatingCartButton() {
  const { openCart, totalItems } = useCart();
  const { t } = useTranslation();

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
      <span className={styles.label}>{t("shop.cart")}</span>
      {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
    </button>
  );
}
