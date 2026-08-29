import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

/**
 * Валідація змінних середовища на старті (fail-fast замість помилок у рантаймі).
 * Для Docker/CI build без реальних значень: SKIP_ENV_VALIDATION=1
 */
export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    DIRECT_URL: z.string().min(1).optional(),
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(16)
        : z.string().min(16).optional(),
    CLOUDINARY_CLOUD_NAME: z.string().trim().min(1).optional(),
    CLOUDINARY_API_KEY: z.string().trim().min(1).optional(),
    CLOUDINARY_API_SECRET: z.string().trim().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().optional(),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    DIRECT_URL: process.env.DIRECT_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY?.trim(),
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET?.trim(),
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
