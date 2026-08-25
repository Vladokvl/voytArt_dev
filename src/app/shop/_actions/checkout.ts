"use server";

import { z } from "zod";
import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

const cartItemSchema = z.object({
  productId: z.number().int().positive(),
  variantId: z.number().int().positive().nullable().optional(),
  quantity: z.number().int().positive().max(999),
});

const checkoutSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  customerPhone: z
    .string()
    .trim()
    .min(7)
    .max(20)
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Невірний формат телефону"),
  customerEmail: z.string().trim().email().max(200),
  deliveryCity: z.string().trim().min(2).max(100),
  deliveryAddress: z.string().trim().min(3).max(300),
  comment: z.string().trim().max(1000).optional(),
  items: z.array(cartItemSchema).min(1).max(50),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;

/** Надійний номер замовлення: 8 hex-символів з CSPRNG замість ~900 комбінацій timestamp. */
function generateOrderNumber(): string {
  return `VA-${new Date().getFullYear()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
}

export async function createOrderAction(data: CheckoutInput): Promise<{
  success: boolean;
  orderNumber?: string;
  error?: string;
}> {
  // 1. Валідація вхідних даних на сервері
  const parsed = checkoutSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Будь ласка, перевірте правильність заповнення полів" };
  }
  const input = parsed.data;

  try {
    const order = await db.$transaction(async (tx) => {
      // 2. Отримуємо свіжі дані продуктів НА СЕРВЕРІ — цінам з клієнта не довіряємо
      const products = await tx.product.findMany({
        where: { id: { in: input.items.map((i) => i.productId) }, isActive: true },
        include: { variants: true },
      });
      const productMap = new Map(products.map((p) => [p.id, p]));

      type PricedItem = {
        productId: number;
        variantId: number | null;
        title: string;
        variantTitle: string | null;
        price: number;
        quantity: number;
      };

      const pricedItems: PricedItem[] = [];
      for (const item of input.items) {
        const product = productMap.get(item.productId);
        if (!product) throw new Error(`PRODUCT_UNAVAILABLE:${item.productId}`);

        let unitPrice = Number(product.price);
        let variantTitle: string | null = null;
        let variantId: number | null = null;

        if (item.variantId) {
          const variant = product.variants.find((v) => v.id === item.variantId);
          if (!variant) throw new Error(`VARIANT_UNAVAILABLE:${item.variantId}`);
          unitPrice = variant.price !== null ? Number(variant.price) : unitPrice;
          variantTitle = variant.title;
          variantId = variant.id;
        }

        // 3. Перевірка стоку перед декрементом
        const availableStock =
          variantId !== null
            ? (product.variants.find((v) => v.id === variantId)?.stock ?? 0)
            : product.stock;
        if (availableStock < item.quantity) {
          throw new Error(`OUT_OF_STOCK:${product.title}`);
        }

        pricedItems.push({
          productId: item.productId,
          variantId,
          title: product.title,
          variantTitle,
          price: unitPrice,
          quantity: item.quantity,
        });
      }

      const totalAmount = pricedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

      // 4. Створення замовлення з retry на колізію orderNumber
      let newOrder: { id: number; orderNumber: string } | null = null;
      for (let attempt = 0; attempt < 3 && !newOrder; attempt++) {
        try {
          newOrder = await tx.order.create({
            data: {
              orderNumber: generateOrderNumber(),
              customerName: input.customerName,
              customerPhone: input.customerPhone,
              customerEmail: input.customerEmail,
              deliveryCity: input.deliveryCity,
              deliveryAddress: input.deliveryAddress,
              comment: input.comment ?? null,
              totalAmount,
              status: "NEW",
              paymentMethod: "COD",
              items: {
                create: pricedItems.map((item) => ({
                  productId: item.productId,
                  variantId: item.variantId,
                  title: item.title,
                  variantTitle: item.variantTitle,
                  price: item.price,
                  quantity: item.quantity,
                })),
              },
            },
          });
        } catch (err) {
          const code = (err as { code?: string }).code;
          if (code === "P2002" && attempt < 2) continue; // unique constraint → новий номер
          throw err;
        }
      }
      if (!newOrder) throw new Error("ORDER_NUMBER_EXHAUSTED");

      // 5. Атомарний декремент стоків: updateMany з where stock >= qty гарантує,
      // що запас ніколи не піде в мінус (0 оновлених рядків = недостатньо стоку)
      for (const item of pricedItems) {
        if (item.variantId) {
          const res = await tx.productVariant.updateMany({
            where: { id: item.variantId, stock: { gte: item.quantity } },
            data: { stock: { decrement: item.quantity } },
          });
          if (res.count === 0) throw new Error(`OUT_OF_STOCK:${item.title}`);
        }
        const resProduct = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (resProduct.count === 0) throw new Error(`OUT_OF_STOCK:${item.title}`);
      }

      return newOrder;
    });

    revalidatePath("/admin/orders");
    revalidatePath("/shop");
    return { success: true, orderNumber: order.orderNumber };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.startsWith("OUT_OF_STOCK:")) {
      return { success: false, error: `На жаль, «${msg.split(":")[1]}» — недостатньо на складі` };
    }
    if (msg.includes("UNAVAILABLE")) {
      return { success: false, error: "Деякі товари більше недоступні. Оновіть кошик." };
    }
    console.error("Order creation error:", err);
    return { success: false, error: "Не вдалося зберегти замовлення. Спробуйте пізніше." };
  }
}
