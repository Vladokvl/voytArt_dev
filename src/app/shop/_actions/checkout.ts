"use server";

import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";

export type CartItemInput = {
  productId: number;
  variantId?: number | null;
  title: string;
  variantTitle?: string | null;
  price: number;
  quantity: number;
};

export type CheckoutInput = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryCity: string;
  deliveryAddress: string;
  comment?: string;
  items: CartItemInput[];
};

export async function createOrderAction(data: CheckoutInput): Promise<{
  success: boolean;
  orderNumber?: string;
  error?: string;
}> {
  if (
    !data.customerName ||
    !data.customerPhone ||
    !data.deliveryCity ||
    !data.deliveryAddress ||
    data.items.length === 0
  ) {
    return { success: false, error: "Будь ласка, заповніть усі обов'язкові поля" };
  }

  const totalAmount = data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const timestamp = Date.now().toString().slice(-4);
  const randomSuffix = Math.floor(10 + Math.random() * 90);
  const orderNumber = `VA-${new Date().getFullYear()}-${timestamp}${randomSuffix}`;

  try {
    const order = await db.$transaction(async (tx) => {
      // 1. Create Order and OrderItems
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          customerEmail: data.customerEmail,
          deliveryCity: data.deliveryCity,
          deliveryAddress: data.deliveryAddress,
          comment: data.comment ?? null,
          totalAmount,
          status: "NEW",
          paymentMethod: "COD",
          items: {
            create: data.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId ?? null,
              title: item.title,
              variantTitle: item.variantTitle ?? null,
              price: item.price,
              quantity: item.quantity,
            })),
          },
        },
      });

      // 2. Decrement variant and product stocks safely
      for (const item of data.items) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    revalidatePath("/admin/orders");
    revalidatePath("/shop");
    return { success: true, orderNumber: order.orderNumber };
  } catch (err) {
    console.error("Order creation error:", err);
    return { success: false, error: "Не вдалося зберегти замовлення. Спробуйте пізніше." };
  }
}
