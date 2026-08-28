# TODO

## Виконано (серпень 2026) — за результатами аудиту безпеки та архітектури

- [x] **Безпека Server Actions:** `requireAdmin` guard для всіх дій адмінки + `getCloudinarySignature`
- [x] **Захист Checkout:** серверний перерахунок цін, atomic stock check (`updateMany`), zod-валідація
- [x] **Захист від XSS:** санітизація Tiptap HTML через DOMPurify (`src/lib/sanitize-html.ts`) у всіх `dangerouslySetInnerHTML`
- [x] **HTTP Security Headers:** додано `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` у `next.config.js`
- [x] **Rate Limiting:** захист логіну (5/15хв), аналітики (30/хв) та запитів (5/10хв) з уніфікованим `getClientIp`
- [x] **Захист від колізій номерів:** CSPRNG `crypto.randomBytes(4)` (8 hex) для замовлень та запитів на картини
- [x] **Захист від DoS/OOM в аналітиці:** обмеження `ANALYTICS_MAX_ROWS = 10_000` у `/admin/analytics`
- [x] **Захист від DoS у пагінації:** обмеження `MAX_LIMIT` та `MAX_OFFSET` у `fetchPaginatedPosts` та `fetchPaginatedPaintings`
- [x] **Цілісність даних (FK constraint `P2003`):** перевірка товарів при видаленні категорій та авто-обнулення `collectionId` при видаленні колекцій
- [x] **Атомарність оновлень:** використання `db.$transaction` при синхронізації варіантів товарів (`updateProductAction`) та перестановці порядку
- [x] **Типи та індекси БД:** `Decimal(10,2)` для цін + індекси на всіх FK (Prisma міграція)
- [x] **i18n route-based:** перехід на `/[locale]` (`/uk`, `/en`), `hreflang`, middleware redirect, збереження сумісності
- [x] **Скрол Lenis:** безпечний React Context (`LenisProvider` + `useLenis()`) для карток, модалок та `Header.tsx`
- [x] **Конфігурація & DX:** прибрано `ignoreBuildErrors`, t3-env валідація середовища, `.gitignore` для `/generated`, CI, Dockerfile, sitemap/robots, unit-тести Vitest

## Наступні кроки

- [ ] **Версіонована система перекладів у БД:** реалізація моделі `TranslationVersion` у PostgreSQL (`jsonb`) з підтримкою відкату (Rollback) через адмінку та кешуванням `unstable_cache`.
- [ ] **E2E тестування:** Playwright тести для flow покупки (`/shop` → checkout), форми запиту (`PaintingInquiry`) та адмін-панелі.
