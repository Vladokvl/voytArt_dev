"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
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
const EMPTY_CART: CartItem[] = [];

// In-memory cache to avoid recreating array references in getSnapshot
let cachedCartString: string | null = null;
let cachedCartItems: CartItem[] = EMPTY_CART;

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);

  const handleStorage = (e: StorageEvent) => {
    if (e.key === CART_STORAGE_KEY) {
      cachedCartString = null;
      notifyListeners();
    }
  };

  window.addEventListener("storage", handleStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function getSnapshot(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_CART;
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw !== cachedCartString) {
      cachedCartString = raw;
      cachedCartItems = raw ? (JSON.parse(raw) as CartItem[]) : EMPTY_CART;
    }
    return cachedCartItems;
  } catch {
    return EMPTY_CART;
  }
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART;
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(items);
    localStorage.setItem(CART_STORAGE_KEY, serialized);
    cachedCartString = serialized;
    cachedCartItems = items;
    notifyListeners();
  } catch (e) {
    console.error("Failed to save cart to localStorage:", e);
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [refreshedOnce, setRefreshedOnce] = useState(false);

  // Refresh product data (prices/stock) from the server once after client load
  useEffect(() => {
    if (refreshedOnce || cart.length === 0) return;
    setRefreshedOnce(true);

    let isMounted = true;

    async function refreshCart() {
      try {
        const productIds = cart.map((i) => i.product.id);
        const fresh = await fetchCartProductsAction(productIds);
        if (!isMounted) return;

        if (fresh.length === 0) {
          saveCart([]);
          return;
        }

        const freshMap = new Map(fresh.map((p) => [p.id, p]));
        const updated = cart.flatMap((item) => {
          const p = freshMap.get(item.product.id);
          if (!p) return [];
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
        });

        saveCart(updated);
      } catch {
        // Silent catch: network failures should not break local cart
      }
    }

    void refreshCart();

    return () => {
      isMounted = false;
    };
  }, [cart, refreshedOnce]);

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
      const currentCart = getSnapshot();

      const existingIdx = currentCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          (item.variantId ?? null) === targetVariantId,
      );

      let nextCart: CartItem[];
      if (existingIdx > -1) {
        nextCart = currentCart.map((item, idx) => {
          if (idx === existingIdx) {
            const updatedQty = Math.min(maxStock, item.quantity + addQty);
            return { ...item, quantity: updatedQty };
          }
          return item;
        });
      } else {
        nextCart = [
          ...currentCart,
          {
            product,
            variantId: targetVariantId,
            variantTitle: targetVariantTitle,
            quantity: Math.min(maxStock, addQty),
          },
        ];
      }

      saveCart(nextCart);
      setIsCartOpen(true);
    },
    [],
  );

  const updateQuantity = useCallback((index: number, delta: number) => {
    const currentCart = getSnapshot();
    if (index < 0 || index >= currentCart.length) return;

    const nextCart = currentCart
      .map((item, idx) => {
        if (idx === index) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return { ...item, quantity: newQty };
        }
        return item;
      })
      .filter(Boolean) as CartItem[];

    saveCart(nextCart);
  }, []);

  const removeFromCart = useCallback((index: number) => {
    const currentCart = getSnapshot();
    const nextCart = currentCart.filter((_, idx) => idx !== index);
    saveCart(nextCart);
  }, []);

  const clearCart = useCallback(() => {
    saveCart([]);
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
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
