"use server";

import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "~/lib/admin-guard";

export async function updateInquiryStatusAction(
  id: number,
  status: "NEW" | "IN_PROGRESS" | "CONTACTED" | "SOLD" | "CANCELLED"
) {
  await requireAdmin();
  try {
    await db.paintingInquiry.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (err) {
    console.error("Failed to update inquiry status:", err);
    return { success: false, error: "Failed to update status" };
  }
}

export async function deleteInquiryAction(id: number) {
  await requireAdmin();
  try {
    await db.paintingInquiry.delete({
      where: { id },
    });
    revalidatePath("/admin/inquiries");
    return { success: true };
  } catch (err) {
    console.error("Failed to delete inquiry:", err);
    return { success: false, error: "Failed to delete inquiry" };
  }
}