"use server";

import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";

export async function updateInquiryStatusAction(
  id: number,
  status: "NEW" | "IN_PROGRESS" | "CONTACTED" | "SOLD" | "CANCELLED"
) {
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
