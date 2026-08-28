import { CartProvider } from "~/context/CartContext";
import CartDrawer from "~/components/shop/CartDrawer";
import FloatingCartButton from "~/components/shop/FloatingCartButton";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
      <FloatingCartButton />
    </CartProvider>
  );
}
