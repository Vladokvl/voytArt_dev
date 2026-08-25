import "server-only";

/**
 * Prisma повертає Decimal-поля як обʼєкти Decimal, які серіалізуються
 * у рядки при передачі в клієнтські компоненти. Конвертуємо в числа
 * на межі сервер/клієнт.
 */
export function decimalToNumber(value: unknown): number {
  return Number(value ?? 0);
}

export function nullableDecimalToNumber(value: unknown): number | null {
  return value === null || value === undefined ? null : Number(value);
}

type VariantWithNumberPrice<V> = V extends object
  ? { [K in keyof V]: K extends "price" ? number | null : V[K] }
  : V;

/** Той самий обʼєкт, але price → number та variants[*].price → number | null. */
export type Plainified<T> = T extends { variants?: (infer V)[] | null } & infer R
  ? R & { price: number; variants: VariantWithNumberPrice<V>[] }
  : T extends object
    ? { [K in keyof T]: K extends "price" ? number : T[K] }
    : T;

/** Продукт (+ варіанти) з числовими цінами; усі інші поля зберігаються як є. */
export function plainProduct<
  T extends { price: unknown; variants?: Array<{ price: unknown }> | null },
>(product: T): Plainified<T> {
  const { price, variants, ...rest } = product;
  const result = {
    ...rest,
    price: decimalToNumber(price),
    variants: (variants ?? []).map((variant) => {
      const { price: variantPrice, ...variantRest } = variant;
      return { ...variantRest, price: nullableDecimalToNumber(variantPrice) };
    }),
  };
  return result as Plainified<T>;
}
