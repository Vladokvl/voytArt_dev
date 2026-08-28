"use server";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { headers } from "next/headers";
import { rateLimit, getClientIp } from "~/lib/rate-limit";

export async function loginAction(
  _prevState: { error: string } | undefined,
  formData: FormData,
): Promise<{ error: string; } | undefined> {
  // Rate-limit: максимум 5 спроб за 15 хвилин на IP
  const headerList = await headers();
  // Уніфіковане читання IP (x-forwarded-for + x-real-ip fallback)
  const ip = getClientIp(headerList);
  const rl = rateLimit(`login:${ip}`, { limit: 5, windowMs: 15 * 60 * 1000 });
  if (!rl.allowed) {
    return {
      error: `Забагато спроб входу. Спробуйте ще раз через ${Math.ceil(rl.retryAfterSeconds / 60)} хв.`,
    };
  }

  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Невірний email або пароль" };
    }
    throw error;
  }
}
