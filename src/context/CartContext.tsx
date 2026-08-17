"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type CartItem = {
  product: {
    id: number;
    title: string;
    price: number;
    coverUrl: string;
    author: { id: number; firstName: string; lastName: string };
    category?: { id: number; name: string; slug: string };
  };
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

  // Load initial cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setCart(JSON.parse(saved) as CartItem[]);
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage:", e);
    }
    setIsHydrated(true);

    const handleExternalSync = () => {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) setCart(JSON.parse(saved) as CartItem[]);
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener("storage", handleExternalSync);
    window.addEventListener("cartUpdated", handleExternalSync);
    return () => {
      window.removeEventListener("storage", handleExternalSync);
      window.removeEventListener("cartUpdated", handleExternalSync);
    };
  }, []);

  // Save cart to localStorage on changes
  const saveCart = useCallback((newCart: CartItem[]) => {
    setCart(newCart);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (e) {
      console.error("Failed to save cart:", e);
    }
  }, []);

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
      setCart((prevCart) => {
        const existingIdx = prevCart.findIndex(
          (item) => item.product.id === product.id && item.variantId === variantId,
        );

        let newCart: CartItem[];
        if (existingIdx > -1) {
          newCart = prevCart.map((item, idx) => {
            if (idx === existingIdx) {
              const updatedQty = Math.min(maxStock, item.quantity + quantity);
              return { ...item, quantity: updatedQty };
            }
            return item;
          });
        } else {
          newCart = [
            ...prevCart,
            {
              product,
              variantId,
              variantTitle,
              quantity: Math.min(maxStock, quantity),
            },
          ];
        }

        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
          window.dispatchEvent(new Event("cartUpdated"));
        } catch (e) {
          console.error(e);
        }

        return newCart;
      });

      setIsCartOpen(true);
    },
    [],
  );

  const updateQuantity = useCallback(
    (index: number, delta: number) => {
      setCart((prevCart) => {
        const newCart = prevCart
          .map((item, idx) => {
            if (idx === index) {
              const newQty = item.quantity + delta;
              if (newQty <= 0) return null;
              return { ...item, quantity: newQty };
            }
            return item;
          })
          .filter(Boolean) as CartItem[];

        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
          window.dispatchEvent(new Event("cartUpdated"));
        } catch (e) {
          console.error(e);
        }

        return newCart;
      });
    },
    [],
  );

  const removeFromCart = useCallback((index: number) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter((_, idx) => idx !== index);
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (e) {
        console.error(e);
      }
      return newCart;
    });
  }, []);

  const clearCart = useCallback(() => {
    saveCart([]);
  }, [saveCart]);

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
