# 📋 Аналіз проєкту VoytArt — слабкі місця та рекомендації

> Дата аналізу: 2026-08-25 · Гілка: dev · Стек: Next.js 15 (App Router), Prisma 7 + PostgreSQL (Supabase), NextAuth v5 beta, Cloudinary, SCSS Modules, GSAP + Framer Motion + Lenis

---

## 🔴 КРИТИЧНІ ПРОБЛЕМИ (виправити негайно)

### 1. Server Actions без перевірки авторизації
**Файли:** `src/app/admin/paintings/_actions.ts`, `src/app/admin/cloudinary-actions.ts`, `src/app/art/_actions.ts`

Middleware захищає лише **навігацію** на `/admin/*`. Server Actions — це публічні HTTP-endpoints, які можна викликати напряму (наприклад, через curl або з консолі браузера), **без жодної сесії**:

- `deletePaintingAction(id)` — будь-хто може видалити будь-яку картину
- `swapPaintingOrderAction`, `movePaintingToPositionAction` — маніпуляція даними
- `getCloudinarySignature()` — **будь-хо може отримати підпис для завантаження файлів у ваш Cloudinary** (риск витрат на трафік/сховище, заливання шкідливого контенту)
- Аналогічно для `_actions.ts` в `authors/`, `products/`, `posts/`, `categories/`, `collections/`, `orders/`, `inquiries/`, `system/`

**Рекомендація:** додати guard на початок кожного admin action:
```ts
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
}
```
Або централізовано — обгортка `withAdmin(action)` / перевірка в кожному файлі `"use server"`.

### 2. Checkout довіряє цінам і кількості з клієнта
**Файл:** `src/app/shop/_actions/checkout.ts`

- `totalAmount` рахується з `item.price`, який надходить із клієнта (localStorage кошика) → **можна замовити товар за ціною 0.01**
- Немає перевірки `stock >= quantity` → запас може піти в мінус
- Немає валідації полів (email, телефон) — хоча `zod` вже встановлений, він не використовується

**Рекомендація:**
```ts
// Всередині $transaction:
const products = await tx.product.findMany({
  where: { id: { in: items.map(i => i.productId) }, isActive: true },
  include: { variants: true },
});
// 1. Порахувати ціну НА СЕРВЕРІ за productId/variantId
// 2. Перевірити stock перед decrement (updateMany з where: { stock: { gte: qty } })
// 3. Валідувати вхідні дані через zod-схему
```

### 3. `ignoreBuildErrors` + `ignoreDuringBuilds` у next.config.js
**Файл:** `next.config.js` (рядки 11–16)

TypeScript-помилки та ESLint-попередження повністю ігноруються при build. Це означає, що типова безпека TypeScript фактично не працює в CI/CD — помилки типів потрапляють у продакшн.

**Рекомендація:** прибрати обидві опції, полагодити накопичені помилки (запустіть `npm run typecheck`), і додати typecheck/lint як обов'язковий крок перед деплоєм.

---

## 🟠 ВИСОКИЙ ПРІОРИТЕТ

### 4. Відсутня rate-limiting / захист від брутфорсу
- `loginAction` (`admin/login/_actions.ts`) — необмежені спроби підбору пароля
- `/api/analytics` (POST) — будь-хто може заспамити БД записами (кожен запит = 2 SQL-запити: dedup-check + insert)
- `createPaintingInquiryAction` — спам запитами

**Рекомендація:** Upstash Ratelimit, або middleware-based throttling по IP для `/api/analytics` і login (наприклад, 5 спроб / 15 хв + тимчасове блокування).

### 5. Колізії номерів замовлень і запитів
- `checkout.ts`: `VA-YYYY-{4 цифри timestamp}{2 випадкові}` — всього ~900 комбінацій на однаковий timestamp → високий шанс collision на unique-полі `orderNumber`
- `_inquiryActions.ts`: `#INQ-{1000..9999}` — всього 9000 варіантів, collision гарантовано з часом → 500 помилка для клієнта

**Рекомендація:** використовувати sequence з БД (`SELECT nextval`) або `crypto.randomUUID().slice(0,8)`, або retry-loop при collision.

### 6. NaN у параметрах URL ламає сторінку
**Файл:** `src/app/art/[[...artistId]]/page.tsx` (рядки 19, 41, 91–92)

`Number(artist)` без перевірки: `/art?artist=abc` → `NaN` → Prisma викине помилку → 500.

**Рекомендація:**
```ts
const parsed = Number(artist);
const selectedAuthorId = artist && Number.isInteger(parsed) && parsed > 0 ? parsed : null;
```
Те саме в `generateMetadata`.

### 7. Гроші у схемі БД — тип `Float`
**Файл:** `prisma/schema.prisma` (`Product.price`, `ProductVariant.price`, `Order.totalAmount`, `OrderItem.price`)

Float непридатний для грошей (помилки округлення). 

**Рекомендація:** мігрувати на `Decimal @db.Decimal(10,2)` або зберігати копійки в `Int`.

### 8. Відсутні індекси на зовнішніх ключах
PostgreSQL **не створює індекси для FK автоматично**. Відсутні:
- `PaintingMedia.paintingId`
- `GalleryPostMedia.postId`
- `ProductImage.productId`, `ProductImage.variantId`
- `OrderItem.orderId`, `OrderItem.productId`, `OrderItem.variantId`

Каскадні видалення та JOIN-и будуть робити seq scan.

**Рекомендація:** додати `@@index([paintingId])` тощо + міграція.

### 9. Згенерований Prisma Client закомічений у репозиторій
Папка `generated/prisma` потрапляє в git (немає в `.gitignore`). Це засмічує diff-и, конфліктує між версіями Prisma.

**Рекомендація:** додати `/generated` до `.gitignore` (client генерується автоматично через `postinstall`).

---

## 🟡 СЕРЕДНІЙ ПРІОРИТЕТ

### 10. Продуктивність: `force-dynamic` скрізь
`gallery/page.tsx`, `shop/page.tsx` — `export const dynamic = "force-dynamic"` вимикає всі кеші. Контент змінюється лише через адмінку.

**Рекомендація:** 
- `export const revalidate = 60` (ISR) + `revalidatePath()` у admin actions (вже частково є)
- Або `unstable_cache` / React `cache()` для запитів

### 11. Паралельність запитів у server actions
- `art/_actions.ts`: `findMany` + `count` послідовно → загорнути в `Promise.all`
- `paintings/_actions.ts` `movePaintingToPositionAction`: N окремих `update` без транзакції → race conditions і часткове оновлення при помилці. Використати `db.$transaction` з одним `UPDATE ... CASE` або `Promise.all` всередині `$transaction`

### 12. Дублювання анімаційних бібліотек
Одночасно: **GSAP + ScrollTrigger**, **Framer Motion**, **Lenis**, плюс `@gsap/react`. Це значний ваг JS-бандла (~100+ KB).

**Рекомендація:** обрати один основний інструмент (GSAP для scroll-анімацій, Framer Motion лише для простих transitions) або винести важкі бібліотеки в dynamic import (`next/dynamic`) тільки там, де вони потрібні.

### 13. i18n реалізований нестабільно
**Файли:** `src/context/LanguageContext.tsx`, `src/lib/i18n.ts`

- Параметр URL `lang=ua`, але локаль `uk` — розбіжність термінології
- Локаль читається з cookie на сервері, але потім перезаписується з localStorage/URL на клієнті → ризик hydration mismatch і «миготіння» мови
- `t()` повертає `path` якщо переклад не знайдено — складно відловити пропущені ключі
- `getLocalized()` шукає `${field}En`, якого ніде нема в схемі (мертвий код)

**Рекомендація (стратегічна):** перейти на route-based локалі `[locale]` (стандарт next-intl / App Router i18n) — це дасть SSR-локаль без миготіння, SEO-friendly URL (`/uk/shop`), статичні переклади. Якщо короткостроково — синхронізувати cookie як єдине джерело правди.

### 14. Analytics: зовнішні HTTP-виклики в критичному шляху
**Файл:** `src/app/api/analytics/route.ts`

- `ip-api.com` викликається по **HTTP (не HTTPS)** — IP користувачів передаються відкритим текстом (privacy ризик)
- Геолокація блокує запис події (до 2.4s при таймаутах двох провайдерів)
- `geoCache` очищається повністю при 3000 елементів (замість LRU)
- Dedup через `findFirst` на кожен event — зайве навантаження на БД

**Рекомендація:** 
- Записувати event одразу, геолокацію — асинхронно/batch-оновленням
- Використати Vercel/Cloudflare geo-headers як основне джерело (вже частково є) і прибрати fallback на ip-api, або переїхати на https-провайдера
- Замість dedup-запиту — унікальний constraint або in-memory TTL-cache

### 15. Хаки зі скролом і глобальними змінними
- `SmoothScroll.tsx`: `(window as any).lenis`, три таймери (0/50/200ms) для «додаткового» ресету — крихко
- `template.tsx`: module-level `let lastPathname` — стан поза React, ламається при StrictMode/паралельних рендерах
- `layout.tsx`: inline `<script>history.scrollRestoration='manual'</script>` конфліктує з обробкою popstate у SmoothScroll

**Рекомендація:** створити React-context для Lenis замість window-глобала; scroll-reset винести в один хук з `useLayoutEffect`; прибрати дублювання логіки scrollRestoration.

### 16. Кошик зберігає снапшот ціни
`CartContext.tsx` зберігає повний об'єкт продукту (включно з `price`) в localStorage. При зміні ціни в адмінці користувач бачить стару ціну (і вона ж відправляється на сервер — див. п.2).

**Рекомендація:** зберігати лише `{productId, variantId, quantity}`, а дані продукту підтягувати свіжими при відкритті кошика/checkout.

---

## 🟢 НИЗЬКИЙ ПРІОРИТЕТ / ЯКІСТЬ ЖИТТЯ

### 17. Інфраструктура та DX
| Проблема | Деталі | Рекомендація |
|---|---|---|
| Немає тестів | Жодного test-runner у залежностях | Додати Vitest + Playwright хоча б для checkout/auth |
| Немає CI | Немає GitHub Actions workflow | CI: lint + typecheck + build (+ тести) |
| Немає Dockerfile | `.dockerignore` і `output: "standalone"` є, а Dockerfile нема | Додати multi-stage Dockerfile |
| Скрипт `db:generate` вводить в оману | Виконує `prisma migrate dev`, а не generate | Перейменувати на `db:migrate:dev`, додати окремий `db:generate` |
| `TODO.md` порожній | — | Видалити або наповнити |
| `.env.example` неповний | Немає `NEXT_PUBLIC_APP_URL`, який використовується в `layout.tsx` | Додати з коментарями |
| Адмін-юзер створюється вручну в БД | README описує ручний INSERT | Додати `prisma/seed-admin.mjs` з bcrypt-хешуванням |

### 18. Валідація середовища
`@t3-oss/env-nextjs` встановлений, але не використовується. Змінні читаються «наослеп» з `process.env` (з хаками `.trim().replace(/^["'].../)` в `cloudinary.ts` — ознака проблем з форматом .env).

**Рекомендація:** впровадити `env.ts` на базі t3-env з zod-схемою — невалідне середовище буде падати на старті, а не в рантаймі.

### 19. Мінорні зауваження по коду
- `lib/i18n.ts` → `formatLocalizedPrice`: курс валют захардкоджений символом `€` — винести в конфіг
- `analytics/route.ts` → коментар каже «daily salt hash», але сіль не використовується (sha256 від ip+UA+date) — або додати сіль, або виправити коментар
- Багато `eslint-disable` з `(window as any)` — типізувати через declaration merging (`declare global { interface Window { lenis?: Lenis } }`)
- `auth.config.ts`: `authorized` callback редіректить через `Response.redirect` — краще використовувати вбудований механізм NextAuth (`redirect` callback), щоб зберігати callbackUrl
- `cloudinary-client.ts`: ліміти розміру файлу перевіряються лише на клієнті — дублювати на сервері (в `getCloudinarySignature`)
- `db.ts`: для Supabase рекомендовано pgBouncer-параметри (`?pgbouncer=true&connection_limit=1`) — переконатись, що `DATABASE_URL` це pooled connection (в .env.example це задокументовано, добре)

### 20. SEO / Metadata
- `sitemap.ts` та `robots.ts` відсутні — додати `app/sitemap.ts` (динамічно з картин/постів/продуктів) і `app/robots.ts`
- Немає JSON-LD structured data (Organization, Product, Artwork) — покращить видачу
- `gallery/[postId]` — перевірити наявність `generateMetadata` для постів (не перевірено в цьому аналізі)

---

## 📊 Пріоритезований план дій

| # | Дія | Пріоритет | Зусилля |
|---|---|---|---|
| 1 | Auth-guard для всіх admin server actions + `getCloudinarySignature` | 🔴 Критично | Середнє |
| 2 | Серверний перерахунок цін + перевірка стоків + zod у checkout | 🔴 Критично | Середнє |
| 3 | Прибрати `ignoreBuildErrors`/`ignoreDuringBuilds`, полагодити помилки | 🔴 Критично | Середнє |
| 4 | Rate limiting (login, analytics, inquiries) | 🟠 Високий | Мале |
| 5 | Надійна генерація orderNumber/inquiryNumber | 🟠 Високий | Мале |
| 6 | Валідація числових URL-параметрів (art page) | 🟠 Високий | Мале |
| 7 | Decimal для цін + індекси FK (міграція) | 🟠 Високий | Середнє |
| 8 | `.gitignore` для `/generated` | 🟠 Високий | Мінімальне |
| 9 | ISR/revalidate замість force-dynamic | 🟡 Середній | Мале |
| 10 | Транзакції та Promise.all у actions | 🟡 Середній | Мале |
| 11 | Рефакторинг i18n (route-based або cookie-only) | 🟡 Середній | Велике |
| 12 | Оптимізація analytics (асинхронна геолокація, HTTPS) | 🟡 Середній | Середнє |
| 13 | Context для Lenis, чистка scroll-хаків | 🟡 Середній | Середнє |
| 14 | Свіжі дані продуктів у кошику | 🟡 Середній | Мале |
| 15 | Тести, CI, Dockerfile, seed адміна, sitemap/robots | 🟢 Низький | Середнє |

---

## ✅ Що зроблено добре

- Чітка структура App Router з colocation server actions поруч зі сторінками
- Prisma-схема добре нормалізована, з осмисленими enum-ами та `@@map` неймінгом
- Global Prisma singleton з кешуванням у dev (`db.ts`)
- Signed uploads до Cloudinary напряму з браузера (правильний патерн, мінус лише відсутній auth-guard)
- `cloudinary-optimize.ts` — продумана система пресетів оптимізації зображень
- `adaptiveQuality.ts` — розумна адаптація якості кадрів під мережу (Save-Data, effectiveType)
- Analytics з bot-filtering, dedup та анонімізованим visitor hash
- Обробка In-App браузерів (Telegram/Instagram) — врахована специфіка аудиторії
- Строгий tsconfig (`strict`, `noUncheckedIndexedAccess`) та type-checked ESLint конфіг