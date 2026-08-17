"use server";

import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";

export type CreateInquiryInput = {
  paintingId: number;
  customerName: string;
  customerContact: string;
  preferredContact?: string;
  message?: string;
};

export async function createPaintingInquiryAction(input: CreateInquiryInput) {
  try {
    const { paintingId, customerName, customerContact, preferredContact = "TELEGRAM", message } = input;

    if (!paintingId || !customerName.trim() || !customerContact.trim()) {
      return { success: false, error: "Будь ласка, заповніть ім'я та контактні дані" };
    }

    // Verify painting exists
    const painting = await db.painting.findUnique({
      where: { id: paintingId },
      include: { author: true },
    });

    if (!painting) {
      return { success: false, error: "Картину не знайдено" };
    }

    // Generate human-readable reference number: e.g. #INQ-4821
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const inquiryNumber = `#INQ-${randomSuffix}`;

    const inquiry = await db.paintingInquiry.create({
      data: {
        inquiryNumber,
        paintingId,
        customerName: customerName.trim(),
        customerContact: customerContact.trim(),
        preferredContact: preferredContact ?? "TELEGRAM",
        message: message?.trim() ?? null,
        status: "NEW",
      },
    });

    revalidatePath("/admin/inquiries");

    return {
      success: true,
      inquiryNumber: inquiry.inquiryNumber,
      inquiryId: inquiry.id,
    };
  } catch (error) {
    console.error("Failed to create painting inquiry:", error);
    return { success: false, error: "Не вдалося надіслати запит. Спробуйте ще раз або напишіть нам у Telegram." };
  }
}
