# 📋 Аналіз проєкту VoytArt — актуальний стан, технічний борг та план дій

> Останнє оновлення: 2026-08-26 · Гілка: `dev` · Стек: Next.js 15 (App Router), Prisma 7 + PostgreSQL (Supabase), NextAuth v5 beta, Cloudinary, SCSS Modules, GSAP + Framer Motion + Lenis

---

## 🎯 Актуальні довгострокові завдання та майбутні покращення

Нижче наведено стратегічні архітектурні завдання, заплановані для наступних ітерацій розвитку:

---

### 1. 🌐 Версіонована система перекладів у БД (`TranslationVersion`)
**Статус:** Архітектурний дизайн затверджено

**Концепція:**
Перенесення системних перекладів інтерфейсу в PostgreSQL (`jsonb`) із версіонуванням:
- Модель `TranslationVersion` (поля `locale`, `version`, `messages`, `comment`, `isActive`, `createdBy`).
- Можливість редагування текстів інтерфейсу (кнопки, заголовки, банери) з адмінки без перескладання сайту.
- **Rollback в один клік** до будь-якої попередньої версії текстів.
- Кешування через `unstable_cache` (`revalidateTag("translations")`) — **0 мс оверхеду** для відвідувачів та безпечний fallback на локальні JSON-файли.

---

### 2. 🧪 Розширення E2E тестування (Playwright)
**Статус:** Базові unit-тести для i18n, парсингу ID та санітизації HTML додано (`vitest`).

**Наступний крок:**
- Створити Playwright E2E-тести для критичних користувацьких сценаріїв:
  1. Додавання товару у кошик та оформлення замовлення (`/shop` → checkout).
  2. Відправка запиту на картину (`PaintingInquiry`).
  3. Авторизація адміністратора та створення/редагування сутності.

---

## 📦 Архів виконаних оптимізацій та виправлень безпеки

Усі виявлені під час комплексного аудиту проблеми повністю вирішені та протестовані:

| Напрямок | Вирішені проблеми |
|---|---|
| **Безпека (Security)** | ✅ Додано `requireAdmin` guard для всіх server actions в адмінці та `getCloudinarySignature`.<br>✅ Впроваджено sliding-window rate limiting для логіну (5/15хв), аналітики (30/хв) та запитів (5/10хв) з уніфікованим `getClientIp`.<br>✅ Захист від Stored XSS: санітизація Tiptap HTML через `isomorphic-dompurify` (`src/lib/sanitize-html.ts`) для всіх `dangerouslySetInnerHTML`.<br>✅ Додано HTTP Security Headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`) у `next.config.js`. |
| **E-Commerce & Цілісність даних** | ✅ Серверний перерахунок цін, atomic stock check (`updateMany` з `stock >= qty`) та Zod-валідація в `checkout.ts`.<br>✅ Міграція грошових полів з `Float` на `Decimal(10,2)` в Prisma.<br>✅ Додано індекси на всі зовнішні ключі (FK) у PostgreSQL.<br>✅ Захист від колізій номерів замовлень та запитів: CSPRNG `crypto.randomBytes(4)` (4.3 млрд варіантів) + retry loop на `P2002`.<br>✅ Атомарна синхронізація варіантів товарів у `db.$transaction` (`updateProductAction`).<br>✅ Захист від `P2003` FK constraint: валідація зв'язаних товарів при видаленні категорій та авто-обнулення `collectionId` при видаленні колекцій. |
| **i18n & SEO** | ✅ Повний перехід на route-based локалі `/[locale]` (`/uk`, `/en`) з підтримкою middleware redirect, cookie & `Accept-Language`.<br>✅ Додано теги `hreflang` (canonical / alternates) у `generateMetadata`.<br>✅ Валідація числових URL-параметрів (`parseIdParam` захист від `NaN` 500 помилок).<br>✅ Динамічні `sitemap.ts` та `robots.ts`, розмітка Schema.org `JsonLd.tsx`. |
| **Продуктивність & UX** | ✅ Захист від DoS/OOM в аналітиці: захисний ліміт вибірки `ANALYTICS_MAX_ROWS = 10_000` у `/admin/analytics`.<br>✅ Захист від DoS у пагінації: клампінг `MAX_LIMIT = 24` та `MAX_OFFSET = 10_000` у `fetchPaginatedPosts` та `fetchPaginatedPaintings`.<br>✅ Замінено `force-dynamic` на ISR (`revalidate = 60`) для `/gallery` та `/shop`.<br>✅ Lenis переведено на React Context (`LenisProvider` + `useLenis()`), виправлено легасі-звернення у `Header.tsx`.<br>✅ HTTPS-геолокація (`ipwho.is`), FIFO geo-cache, in-memory dedup та нормалізація шляхів для `/api/analytics`. |
| **Архітектура & DX** | ✅ Прибрано `ignoreBuildErrors` та `ignoreDuringBuilds` із `next.config.js`.<br>✅ Типізована валідація змінних середовища через `@t3-oss/env-nextjs` (`src/env.js`).<br>✅ Папку `/generated` вилучено з git і додано до `.gitignore`.<br>✅ Unit-тести на Vitest (`i18n.test.ts`, `parse-id.test.ts`, `sanitize-html.test.ts`).<br>✅ Налаштовано CI (GitHub Actions), Multi-stage Dockerfile, seed-скрипти та оновлено `.env.example`. |