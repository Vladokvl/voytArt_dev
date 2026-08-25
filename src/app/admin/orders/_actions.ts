"use server";

import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";
import { type OrderStatus } from "~/../generated/prisma";
import { requireAdmin } from "~/lib/admin-guard";

export async function updateOrderStatusAction(orderId: number, status: OrderStatus) {
  await requireAdmin();
  await db.order.update({
    where: { id: orderId },
    data: { status },
  });
  revalidatePath("/admin/orders");
}

export async function deleteOrderAction(orderId: number) {
  await requireAdmin();
  await db.order.delete({
    where: { id: orderId },
  });
  revalidatePath("/admin/orders");
}
