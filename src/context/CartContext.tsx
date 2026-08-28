"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { fetchCartProductsAction } from "~/app/(site)/[locale]/shop/_actions/cart-refresh";

export type CartProduct = {
  id: number;
  title: string;
  price: number;
  coverUrl: string;
  author?: { id: number; firstName: string; lastName: string } | null;
  category?: { id: number; name: string; slug: string };
  stock?: number;
  variants?: Array<{ id: number; title: string; titleUk?: string | null; price: number | null; stock: number }> | null;
};

export type CartItem = {
  product: CartProduct;
  variantId?: number | null;
  variantTitle?: string | null;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: {
    product: CartItem["product"];
    variantId?: number | null;
    variantTitle?: string | null;
    quantity?: number;
    maxStock?: number;
  }) => void;
  updateQuantity: (index: number, delta: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "voyt_art_cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Load initial cart from localStorage on mount
  useEffect(() => {
    let savedItems: CartItem[] = [];
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        savedItems = JSON.parse(saved) as CartItem[];
        setCart(savedItems);
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage:", e);
    }
    setIsHydrated(true);

    // Sync across browser tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY && e.newValue) {
        try {
          setCart(JSON.parse(e.newValue) as CartItem[]);
        } catch (err) {
          console.error(err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // 1b. Refresh product data (prices/stock) from the server after hydration —
  // localStorage містить лише снапшот, тому ціни можуть застаріти
  useEffect(() => {
    if (!isHydrated) return;
    setCart((current) => {
      if (current.length === 0) return current;
      // fire-and-forget refresh
      void (async () => {
        try {
          const fresh = await fetchCartProductsAction(current.map((i) => i.product.id));
          if (fresh.length === 0) {
            setCart([]);
            return;
          }
          const freshMap = new Map(fresh.map((p) => [p.id, p]));
          setCart((prev) =>
            prev.flatMap((item) => {
              const p = freshMap.get(item.product.id);
              if (!p) return []; // продукт видалено/деактивовано
              const variant =
                item.variantId != null ? p.variants?.find((v) => v.id === item.variantId) : null;
              const maxStock = variant ? variant.stock : (p.stock ?? 999);
              const qty = Math.min(item.quantity, Math.max(1, maxStock));
              return [
                {
                  ...item,
                  quantity: qty,
                  variantTitle: variant ? variant.title : item.variantTitle,
                  product: { ...p },
                },
              ];
            }),
          );
        } catch {
          // не блокуємо кошик, якщо refresh не вдався
        }
      })();
      return current;
    });
  }, [isHydrated]);

  // 2. Persist cart to localStorage whenever it changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage:", e);
    }
  }, [cart, isHydrated]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addToCart = useCallback(
    ({
      product,
      variantId = null,
      variantTitle = null,
      quantity = 1,
      maxStock = 999,
    }: {
      product: CartItem["product"];
      variantId?: number | null;
      variantTitle?: string | null;
      quantity?: number;
      maxStock?: number;
    }) => {
      const targetVariantId = variantId ?? null;
      const targetVariantTitle = variantTitle ?? null;
      const addQty = Math.max(1, quantity);

      setCart((prevCart) => {
        const existingIdx = prevCart.findIndex(
          (item) =>
            item.product.id === product.id &&
            (item.variantId ?? null) === targetVariantId,
        );

        if (existingIdx > -1) {
          return prevCart.map((item, idx) => {
            if (idx === existingIdx) {
              const updatedQty = Math.min(maxStock, item.quantity + addQty);
              return { ...item, quantity: updatedQty };
            }
            return item;
          });
        }

        return [
          ...prevCart,
          {
            product,
            variantId: targetVariantId,
            variantTitle: targetVariantTitle,
            quantity: Math.min(maxStock, addQty),
          },
        ];
      });

      setIsCartOpen(true);
    },
    [],
  );

  const updateQuantity = useCallback((index: number, delta: number) => {
    setCart((prevCart) => {
      if (index < 0 || index >= prevCart.length) return prevCart;
      return prevCart
        .map((item, idx) => {
          if (idx === index) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCart((prevCart) => prevCart.filter((_, idx) => idx !== index));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalItems = isHydrated
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const totalPrice = isHydrated
    ? cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    : 0;

  return (
    <CartContext.Provider
      value={{
        cart: isHydrated ? cart : [],
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
