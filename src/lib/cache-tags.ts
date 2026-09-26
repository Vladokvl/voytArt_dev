/**
 * Теги для unstable_cache — дозволяють точково інвалідовувати
 * кешовані запити БД після змін в адмінці.
 */
export const CACHE_TAGS = {
  /** Каталог магазину: продукти, варіанти, категорії */
  shop: "shop",
  /** Галерея постів */
  gallery: "gallery",
  /** Каталог картин / автори / колекції */
  art: "art",
  /** Налаштування сайту (Coming Soon тощо) */
  settings: "settings",
  /** Переклади інтерфейсу сайту */
  translations: "translations",
} as const;