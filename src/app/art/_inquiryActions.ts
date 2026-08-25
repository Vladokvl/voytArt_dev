"use server";

import { db } from "~/lib/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import crypto from "crypto";
import { rateLimit } from "~/lib/rate-limit";

export type CreateInquiryInput = {
  paintingId: number;
  customerName: string;
  customerContact: string;
  preferredContact?: string;
  message?: string;
};

export async function createPaintingInquiryAction(input: CreateInquiryInput) {
  try {
    // Rate-limit: максимум 5 запитів за 10 хвилин на IP
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rl = rateLimit(`inquiry:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 });
    if (!rl.allowed) {
      return { success: false, error: "Забагато запитів. Спробуйте пізніше." };
    }

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

    // Надійний номер запиту: 4 байти CSPRNG (замість 9000 варіантів Math.random)
    // + retry на колізію unique-поля
    let inquiry: { inquiryNumber: string; id: number } | null = null;
    for (let attempt = 0; attempt < 3 && !inquiry; attempt++) {
      const inquiryNumber = `#INQ-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
      try {
        inquiry = await db.paintingInquiry.create({
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
      } catch (err) {
        const code = (err as { code?: string }).code;
        if (code === "P2002" && attempt < 2) continue;
        throw err;
      }
    }
    if (!inquiry) throw new Error("INQUIRY_NUMBER_EXHAUSTED");

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
