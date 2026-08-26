# 📋 Аналіз проєкту VoytArt — актуальний стан, технічний борг та план дій

> Останнє оновлення: 2026-08-26 · Гілка: `dev` · Стек: Next.js 15 (App Router), Prisma 7 + PostgreSQL (Supabase), NextAuth v5 beta, Cloudinary, SCSS Modules, GSAP + Framer Motion + Lenis

---

## 🎯 Актуальні завдання та технічний борг

Нижче наведено задачі, які ще потребують реалізації, з готовими технічними рішеннями та рекомендаціями.

---

### 1. 🌐 Route-based i18n (`/[locale]/...`)
**Статус:** Заплановано (високий вплив на SEO)

**Поточний стан:**
Локаль визначається через cookie `NEXT_LOCALE` або заголовок запиту, контент рендериться на клієнті через `LanguageContext`. Усі мови знаходяться на одній URL-адресі.
- 🔴 Мінуси: Немає локалізованих URL для індексації пошуковими системами (`/uk/shop`, `/en/shop`), відсутні теги `hreflang`, можливий ризик hydration mismatch.

**Рекомендоване рішення (поетапно):**
1. **Структура маршрутизації:**
   - Перенести публічні сторінки у структуру `src/app/[locale]/...` (`art`, `gallery`, `shop`, головна).
   - Адмін-панель (`/admin`) залишити поза локаллю (або зафіксувати однією мовою).
   - `generateStaticParams()` повертає `[{ locale: 'uk' }, { locale: 'en' }]`.
2. **Middleware:**
   - Автоматичний редирект з `/` на `/{locale}` на основі заголовка `Accept-Language` або збереженої cookie.
3. **SEO та метадані:**
   - Додати `alternates: { languages: { 'uk-UA': '/uk/...', 'en-US': '/en/...' } }` у `generateMetadata`.
   - Оновити `sitemap.ts` для генерації посилань для кожної локалі.
4. **Контекст та клієнтський стан:**
   - Передавати `locale` з серверного сегмента маршруту в `LanguageProvider initialLocale={locale}` без потреби читання `document.cookie` на клієнті під час рендеру.

---

### 2. 🧪 Тестування (Vitest + Playwright)
**Статус:** Частково виконано — Vitest налаштовано ✅ (2026-08-26), Playwright e2e — не розпочато

**Виконано:**
- Додано `vitest` + `vitest.config.ts` з аліасами `~/` і `@/`, скрипти `npm test` / `npm run test:watch`.
- Unit-тести чистих утиліт: `src/lib/i18n.test.ts` (13 тестів: `getLocalized` fallback-логіка, `formatLocalizedPrice`, `formatLocalizedDate`) та `src/lib/parse-id.test.ts` (5 тестів).
- `parseIdParam` винесено з `/art`-сторінки в бібліотеку `src/lib/parse-id.ts` для повторного використання й тестування.
- Крок `npm test` додано в `.github/workflows/ci.yml` перед Build.
- **Поточний стан тестів:** 18 passed.

**Залишилось:**
1. **Integration-тести checkout** (`checkout.ts`: розрахунок цін, перевірка стоків) — потрібен мок Prisma (vitest-mock-extended) або окрема тестова БД через docker-compose.
2. **E2E (Playwright):** сценарії checkout, PaintingInquiry, авторизація + CRUD в адмінці. Встановити `@playwright/test`, конфіг із `webServer: npm run dev`.

---

### 3. 🏷️ Структуровані дані JSON-LD (Schema.org)
**Статус:** ✅ Виконано (2026-08-26)

- Створено компонент `src/components/seo/JsonLd.tsx` (server component, з екрануванням `<` проти XSS).
- Головна сторінка: `Organization` + `WebSite`.
- `/art`: `ItemList` із `VisualArtwork` (title, image, creator, description, dateCreated) для кожної картини видачі.
- `/shop/[id]`: `Product` + `Offer` (priceCurrency EUR, price, InStock/порожньо при stock=0, itemCondition New).
- `/gallery/[postId]`: `Article` (headline, image, datePublished/dateModified, author/publisher Organization).

Рекомендація: після деплою перевірити сторінки у [Rich Results Test](https://search.google.com/test/rich-results) та Search Console.

---

### 4. ⚡ Оптимізація розміру JS-бандла
**Статус:** Частково виконано (2026-08-26)

**Виконано:**
- Аудит: TipTap уже динамічний (6 адмін-форм через `next/dynamic`); `@imgly/background-removal` уже динамічний (`await import`) всередині `ImageCropModal`.
- Створено `LazyImageCropModal.tsx` (динамічний імпорт `react-easy-crop`, `ssr:false`) — підключено в усіх 12 адмін-формах; важкий кропер більше не в основному чанку адмін-сторінок.
- Додано `@next/bundle-analyzer`: `npm run analyze` (= `cross-env ANALYZE=true next build`) → звіти в `.next/analyze/*`.
- Публічний бандл не містить ані одну з важких адмінських залежностей (перевірено по маршрутах build: `/art` 205 kB First Load — без росту від JSON-LD).

**Залишилось (архітектурні рішення):**
- Розподіл сфер GSAP+Lenis / Framer Motion — за потреби при рефакторингу анімацій.
- Розглянути `Lora/Playfair`-шрифти, великі mp4-hero (frontend-стратегія, поза бандлом).

---

## 📦 Архів виконаних оптимізацій (Серпень 2026)

Усі критичні та високого пріоритету проблеми з початкового аудиту успішно вирішені:

| Напрямок | Вирішені проблеми |
|---|---|
| **Безпека** | ✅ Додано `requireAdmin` guard для всіх server actions в адмінці та `getCloudinarySignature`.<br>✅ Впроваджено rate limiting для логіну (5/15хв), аналітики (30/хв) та запитів (5/10хв). |
| **E-Commerce & Дані** | ✅ Серверний перерахунок цін, atomic stock check (`updateMany`) та Zod-валідація в `checkout.ts`.<br>✅ Міграція грошових полів з `Float` на `Decimal(10,2)` в Prisma.<br>✅ Додано індекси на всі зовнішні ключі (FK) у PostgreSQL.<br>✅ Безпечна генерація номерів замовлень/запитів через CSPRNG із захистом від колізій. |
| **Архітектура & DX** | ✅ Прибрано `ignoreBuildErrors` та `ignoreDuringBuilds` із `next.config.js`.<br>✅ Типізована валідація змінних середовища через `@t3-oss/env-nextjs` (`src/env.js`).<br>✅ Папку `/generated` вилучено з git і додано до `.gitignore`.<br>✅ Налаштовано CI (GitHub Actions), Multi-stage Dockerfile, seed-скрипти та оновлено `.env.example`. |
| **Продуктивність** | ✅ Замінено `force-dynamic` на ISR (`revalidate = 60`) для `/gallery` та `/shop`.<br>✅ Оптимізовано server actions (використання `$transaction` та `Promise.all`).<br>✅ Переведено Lenis на React Context (`LenisProvider` + `useLenis()`), усунуто конфлікти з `window.lenis`.<br>✅ HTTPS-геолокація та in-memory dedup для `/api/analytics`. |
| **SEO & Помилки** | ✅ Валідація числових URL-параметрів на `/art` (захист від `NaN` 500 помилок).<br>✅ Додано динамічні `sitemap.ts` та `robots.ts`. |