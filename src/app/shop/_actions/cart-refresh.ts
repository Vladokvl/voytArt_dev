"use server";

import { db } from "~/lib/db";
import { plainProduct } from "~/lib/plain-product";
import type { CartProduct } from "~/context/CartContext";

/** Повертає свіжі дані продуктів для кошика (ціни/стоки з БД, не з localStorage). */
export async function fetchCartProductsAction(
  productIds: number[],
): Promise<CartProduct[]> {
  const ids = [...new Set(productIds)].filter((id) => Number.isInteger(id) && id > 0);
  if (ids.length === 0) return [];

  const products = await db.product.findMany({
    where: { id: { in: ids }, isActive: true },
    include: {
      author: { select: { id: true, firstName: true, lastName: true } },
      category: { select: { id: true, name: true, slug: true } },
      variants: { orderBy: { sortOrder: "asc" } },
    },
  });

  return products.map((p) => ({
    ...plainProduct(p),
    images: undefined,
    orderItems: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  }));
}
