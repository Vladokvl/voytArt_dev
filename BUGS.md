# 🐛 BUGS.md — Аудит проєкту VoytArt (2026-08-29)

> Повний аудит коду на баги, безпеку, перфоменс та UX.
> Знайдено **32 проблеми**: 4 критичних, 8 високих, 13 середніх, 7 низьких.

---

## Зміст

- [🔴 CRITICAL — Критичні](#-critical--критичні)
- [🟠 HIGH — Високий пріоритет](#-high--високий-пріоритет)
- [🟡 MEDIUM — Середній пріоритет](#-medium--середній-пріоритет)
- [🟢 LOW — Низький пріоритет](#-low--низький-пріоритет)

---

## 🔴 CRITICAL — Критичні

### C-1. Checkout Server Action без Rate Limiting

| | |
|---|---|
| **Файл** | `src/app/(site)/[locale]/shop/_actions/checkout.ts` |
| **Категорія** | SECURITY / BUG |
| **Опис** | Server Action `createOrderAction` не має жодного rate limiting. Зловмисник може автоматизовано спамити тисячі замовлень за секунду, забиваючи базу фейковими ордерами та обнулюючи стоки. На відміну від inquiry action (який має `rateLimit`), checkout повністю відкритий. |
| **Фікс** | Додати `rateLimit` за IP (аналогічно до `createPaintingInquiryAction`): |

```typescript
// На початку createOrderAction:
const headerList = await headers();
const ip = getClientIp(headerList);
const rl = rateLimit(`checkout:${ip}`, { limit: 5, windowMs: 60 * 1000 });
if (!rl.allowed) {
  return { success: false, error: "Забагато запитів. Спробуйте пізніше." };
}
```

---

### C-2. Відсутність `error.tsx` у всьому проєкті

| | |
|---|---|
| **Файл** | `src/app/(site)/` та `src/app/(admin)/` |
| **Категорія** | UX / BUG |
| **Опис** | У жодному маршруті немає файлу `error.tsx`. Якщо база даних тимчасово недоступна або Prisma-запит падає — юзер бачить **raw 500 error** або порожню сторінку без будь-якого пояснення чи кнопки "Спробувати знову". |
| **Фікс** | Створити `error.tsx` мінімум у: |

- `src/app/(site)/[locale]/error.tsx` — для публічного сайту
- `src/app/(admin)/admin/error.tsx` — для адмінки

```tsx
"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
      <h2>Щось пішло не так</h2>
      <p>{error.message || "Невідома помилка"}</p>
      <button onClick={reset}>Спробувати знову</button>
    </div>
  );
}
```

---

### C-3. Відсутність `loading.tsx` — "замерзання" UI під час навігації

| | |
|---|---|
| **Файл** | `src/app/(site)/[locale]/shop/`, `src/app/(site)/[locale]/art/`, `src/app/(admin)/` |
| **Категорія** | UX |
| **Опис** | Сторінки shop, art та admin виконують серверні DB-запити (`await db.product.findMany()`, `await db.painting.findMany()`) перед рендером. Без `loading.tsx` Next.js не показує нічого поки сервер обробляє запит — сторінка виглядає "замерзлою" на 1-5 секунд, особливо на повільних з'єднаннях. |
| **Фікс** | Створити `loading.tsx` зі skeleton-лоадером для кожної секції: |

- `src/app/(site)/[locale]/shop/loading.tsx`
- `src/app/(site)/[locale]/art/[[...artistId]]/loading.tsx`
- `src/app/(site)/[locale]/gallery/loading.tsx`

---

### C-4. `next-auth@5.0.0-beta.25` — нестабільний бета-пакет у продакшені

| | |
|---|---|
| **Файл** | `package.json` (рядок 53) |
| **Категорія** | SECURITY |
| **Опис** | Використовується бета-версія `next-auth@5.0.0-beta.25`. Бета-версії Auth.js мають відомі вразливості (open redirect, session fixation) та нестабільний API, який може ламатись при оновленні Next.js. |
| **Фікс** | Оновити до останнього стабільного релізу `next-auth` v5 (RC або stable). |

---

## 🟠 HIGH — Високий пріоритет

### H-1. Memory leak: `URL.createObjectURL()` без `revokeObjectURL()`

| | |
|---|---|
| **Файл** | `src/hooks/use-image-crop.ts` (рядки 40, 65) |
| **Категорія** | PERFORMANCE / BUG |
| **Опис** | Хук `useImageCrop` створює blob-URL через `URL.createObjectURL(file)` для превʼю зображень і відео, але ніколи не викликає `URL.revokeObjectURL()` для звільнення памʼяті. При повторному вибиранні файлів у адмінці накопичуються незвільнені blob-обʼєкти, що призводить до зростання памʼяті (memory bloat). |
| **Фікс** | Зберігати попередній URL і звільняти його перед створенням нового: |

```typescript
// У processFile:
const newUrl = URL.createObjectURL(file);
// У setPreview callback — перед встановленням нового:
if (previousUrl) URL.revokeObjectURL(previousUrl);
setPreview(newUrl);
```

---

### H-2. SmoothScroll ламає навігацію "Назад" (scroll restoration)

| | |
|---|---|
| **Файл** | `src/components/SmoothScroll/SmoothScroll.tsx` (рядки 36-47) |
| **Категорія** | UX / BUG |
| **Опис** | Обробник `popstate` примусово скролить до `(0, 0)` при натисканні кнопки "Назад". Це ламає нативну поведінку браузера, де юзер очікує повернутися на попередню позицію скролу (наприклад, повернувся зі сторінки картини в галерею — скрол стрибає вгору замість місця, де він клікнув). |
| **Фікс** | Видалити примусовий `window.scrollTo(0, 0)` з `handlePopState`. Для Lenis можна зберігати позицію скролу в `sessionStorage` перед навігацією та відновлювати її на `popstate`. |

---

### H-3. Dockerfile: Prisma CLI в продакшен-образі + відсутність `--chown`

| | |
|---|---|
| **Файл** | `Dockerfile` (рядки 38-40) |
| **Категорія** | PERFORMANCE / SECURITY |
| **Опис** | 1) `node_modules/prisma` (Prisma CLI, ~40 MB) копіюється у фінальний runner-образ, хоча рантайм потребує лише `@prisma/client` та engine binaries. Це роздуває Docker image. 2) `COPY --from=deps` на рядках 38-40 не має `--chown=nextjs:nodejs`, що може призвести до permission denied або запуску процесу від root. |
| **Фікс** | |

```dockerfile
# Прибрати непотрібний Prisma CLI:
# COPY --from=deps /app/node_modules/prisma ./node_modules/prisma  ← ВИДАЛИТИ

# Додати --chown для усіх deps-копій:
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=deps --chown=nextjs:nodejs /app/generated ./generated
```

---

### H-4. `fetchPaginatedPaintings` — без обмеження `offset`/`limit` від клієнта

| | |
|---|---|
| **Файл** | `src/app/(site)/[locale]/art/_actions.ts` (рядки 4-35) |
| **Категорія** | SECURITY / PERFORMANCE |
| **Опис** | На відміну від `fetchPaginatedPosts` (яка має `MAX_LIMIT = 24` і `MAX_OFFSET = 10_000`), `fetchPaginatedPaintings` приймає довільні `offset` та `limit` з клієнта. Хоча `Math.min(50, ...)` обмежує take, `offset` необмежений — зловмисник може надіслати `offset: 999999999`, створюючи навантаження на БД. |
| **Фікс** | Додати жорсткі ліміти аналогічно до gallery actions: |

```typescript
const MAX_OFFSET = 10_000;
const safeOffset = Number.isInteger(offset) && offset > 0 ? Math.min(offset, MAX_OFFSET) : 0;
```

---

### H-5. Масштабне споживання RAM для кешування кадрів Hero

| | |
|---|---|
| **Файл** | `src/components/home/Hero/HeroDesktop.tsx` |
| **Категорія** | PERFORMANCE |
| **Опис** | Компонент Hero кешує до 120 повних `Image` обʼєктів (`new Image()`) для scrubbing-анімації. На дисплеях 1080p+ це може споживати 100–200 MB+ нестисненої bitmap-памʼяті в RAM. Коли кеш переповнюється, обʼєкти видаляються з `Map`, але bitmap не звільняється явно. |
| **Фікс** | Використати `createImageBitmap(blob)` замість `new Image()` і явно викликати `bitmap.close()` при видаленні з кешу для звільнення GPU/CPU памʼяті. |

---

### H-6. I18n-словники завантажуються синхронно у клієнтський бандл

| | |
|---|---|
| **Файл** | `src/lib/i18n.ts` (рядки 1-2) |
| **Категорія** | PERFORMANCE |
| **Опис** | `en.json` і `uk.json` імпортуються статично (`import en from "../messages/en.json"`). Обидва файли-словники потрапляють у початковий клієнтський бандл, подвоюючи обсяг переказів навіть якщо юзер використовує лише одну мову. |
| **Фікс** | Використати динамічний імпорт `import()` на основі активної локалі, або завантажувати словник на сервері та передавати через контекст/props тільки потрібну мову. |

---

### H-7. Sitemap мовчки приховує помилку БД

| | |
|---|---|
| **Файл** | `src/app/sitemap.ts` (рядки 59-61) |
| **Категорія** | SEO / BUG |
| **Опис** | Якщо база тимчасово недоступна, `catch` блок мовчки повертає `staticRoutes` з HTTP 200 OK. Пошукові боти (Google, Bing) побачать повну sitemap без динамічних сторінок (товарів, постів) і можуть де-індексувати їх. |
| **Фікс** | Прибрати `catch` або кинути 500 помилку, щоб боти зробили retry пізніше: |

```typescript
// Варіант 1: прибрати catch, нехай Next.js верне 500
// Варіант 2: логувати і re-throw
} catch (err) {
  console.error("Sitemap generation failed:", err);
  throw err;
}
```

---

### H-8. Відсутність `not-found.tsx` — юзер бачить дефолтну 404

| | |
|---|---|
| **Файл** | `src/app/(site)/[locale]/` |
| **Категорія** | UX |
| **Опис** | У проєкті немає кастомного `not-found.tsx`. При переході на неіснуючий URL (наприклад, `/en/shop/99999` або `/en/abc`) юзер бачить дефолтну сторінку Next.js "404 - This page could not be found", яка не відповідає дизайну сайту. |
| **Фікс** | Створити `src/app/(site)/[locale]/not-found.tsx` з брендованим дизайном і посиланням на головну. |

---

## 🟡 MEDIUM — Середній пріоритет

### M-1. Відсутність CSP та HSTS у security-заголовках

| | |
|---|---|
| **Файл** | `next.config.js` (рядки 42-63) |
| **Категорія** | SECURITY |
| **Опис** | Є базові заголовки (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`), але відсутні `Content-Security-Policy` (CSP) та `Strict-Transport-Security` (HSTS). Без CSP сайт вразливий до XSS через інʼєкцію стороннього скрипту. Без HSTS — до downgrade атак. |
| **Фікс** | Додати у масив `headers()`: |

```javascript
{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
{ key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' res.cloudinary.com images.unsplash.com data:; font-src 'self'; connect-src 'self' ipwho.is; frame-ancestors 'none'" },
```

---

### M-2. `callbackUrl` у auth redirect не валідується — потенційний Open Redirect

| | |
|---|---|
| **Файл** | `src/middleware.ts` (рядок 37), `src/auth.config.ts` (рядок 18) |
| **Категорія** | SECURITY |
| **Опис** | `callbackUrl` з query-параметрів підставляється у redirect без перевірки, чи є URL відносним та належить до поточного домену. Зловмисник може створити посилання `/admin/login?callbackUrl=https://evil.com`, і після логіну адмін буде перенаправлений на шкідливий сайт. |
| **Фікс** | Валідувати `callbackUrl` — дозволяти тільки відносні шляхи, що починаються з `/admin`: |

```typescript
const callbackUrl = nextUrl.searchParams.get("callbackUrl");
const safeCallback = callbackUrl?.startsWith("/admin") ? callbackUrl : "/admin";
return NextResponse.redirect(new URL(safeCallback, nextUrl));
```

---

### M-3. Reverse tabnabbing через `target="_blank"` у санітизованому HTML

| | |
|---|---|
| **Файл** | `src/lib/sanitize-html.ts` (рядок 24) |
| **Категорія** | SECURITY |
| **Опис** | DOMPurify дозволяє атрибут `target` (включаючи `_blank`), але не примусово додає `rel="noopener noreferrer"`. Tiptap-контент з БД може містити `<a href="..." target="_blank">`, що створює вразливість reverse tabnabbing. |
| **Фікс** | Додати DOMPurify hook: |

```typescript
DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A" && node.getAttribute("target") === "_blank") {
    node.setAttribute("rel", "noopener noreferrer");
  }
});
```

---

### M-4. Ref замість State у рендері — десинхронізація UI

| | |
|---|---|
| **Файл** | `src/components/home/Hero/HeroDesktop.tsx` |
| **Категорія** | BUG |
| **Опис** | В JSX використовується `isMobileRef.current` для умовного рендерингу замість відповідного state-значення. Оскільки зміна ref не тригерить перерендер, компонент може відображати застарілий стан (наприклад, показувати десктопний контент на мобайлі після зміни розміру екрану). |
| **Фікс** | Замінити `!isMobileRef.current` на `!isMobileState` (state-змінна, яка вже визначена). |

---

### M-5. `CartContext` — гідраційна розсинхронізація з `localStorage`

| | |
|---|---|
| **Файл** | `src/context/CartContext.tsx` (рядки 52-81, 133-141) |
| **Категорія** | BUG / UX |
| **Опис** | Корзина зберігається в `localStorage` і зчитується через `useEffect`. Між SSR (порожня корзина) та гідрацією (дані з localStorage) є мигання — юзер може побачити badge "0 items" на мить перед тим, як зʼявиться реальна кількість. Також `storage` event listener для sync між табами може спричинити неочікувані re-render. |
| **Фікс** | Рефакторити на `useSyncExternalStore` (React 18+) для безпечного SSR та коректної підписки на localStorage: |

```typescript
import { useSyncExternalStore } from "react";

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getCartSnapshot(): CartItem[] {
  try { return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]"); }
  catch { return []; }
}

const cart = useSyncExternalStore(subscribeToStorage, getCartSnapshot, () => []);
```

---

### M-6. Shop page: всі продукти завантажуються одразу з `author: true`

| | |
|---|---|
| **Файл** | `src/app/(site)/[locale]/shop/page.tsx` (рядки 31-43) |
| **Категорія** | PERFORMANCE |
| **Опис** | `db.product.findMany()` з `include: { images, variants, author: true, category: true }` завантажує повні дані авторів (bio, photoUrl, bgPhotoUrl тощо) для кожного продукту, хоча на сторінці магазину потрібні лише `firstName` та `lastName`. Це зайвий обсяг даних із БД. |
| **Фікс** | Замінити `author: true` на `select`: |

```typescript
author: {
  select: { id: true, firstName: true, firstNameUk: true, lastName: true, lastNameUk: true }
},
```

---

### M-7. `framesManifest.ts` — 87 KB статичних даних у бандлі

| | |
|---|---|
| **Файл** | `src/data/framesManifest.ts` (87 826 байт) |
| **Категорія** | PERFORMANCE |
| **Опис** | Файл манифесту кадрів Hero-секції важить ~88 KB. Якщо він імпортується на клієнті, це збільшує initial bundle size. |
| **Фікс** | Винести цей файл в JSON і завантажувати динамічно через `fetch()` або `import()` тільки коли Hero компонент монтується. |

---

### M-8. Ціна форматується з хардкоданою локаллю `en-US`

| | |
|---|---|
| **Файл** | `src/app/(site)/[locale]/shop/[id]/_ProductView.tsx` (рядок 235), `_ShopStorefront.tsx` (рядок 253) |
| **Категорія** | UX / BUG |
| **Опис** | `currentPrice.toLocaleString("en-US")` і `product.price.toLocaleString("en-US")` ігнорують вибрану локаль юзера. Для української локалі ціна має форматуватися з пробілом як розділювачем тисяч (наприклад, `1 500 €` замість `1,500 €`). При цьому у `src/lib/i18n.ts` вже є функція `formatLocalizedPrice()`, яка не використовується. |
| **Фікс** | Замінити прямі виклики `toLocaleString("en-US")` на `formatLocalizedPrice(price, locale)` з `~/lib/i18n`. |

---

### M-9. Двоступінчата перевірка auth в middleware — зайва дублікація

| | |
|---|---|
| **Файл** | `src/middleware.ts` (рядки 24-41) та `src/auth.config.ts` (рядки 9-20) |
| **Категорія** | CODE_QUALITY |
| **Опис** | Логіка перевірки автентифікації адмінських маршрутів дублюється: і в middleware (`isAdminRouteProtected`), і в auth.config callbacks. Це ускладнює підтримку — зміна в одному місці може не відобразитися в іншому. |
| **Фікс** | Тримати авторизаційну логіку в одному місці — або тільки в middleware, або тільки в `authConfig.callbacks.authorized`. |

---

### M-10. `env.js` — ручна чистка лапок у секретах

| | |
|---|---|
| **Файл** | `src/env.js` (рядки 25-27) |
| **Категорія** | BUG |
| **Опис** | `replace(/^["']|["']$/g, "")` ручна очистка лапок із CLOUDINARY env-змінних. Якщо валідний секрет починається або закінчується символом лапки, він буде обрізаний. Це крихкий підхід. |
| **Фікс** | Виправити `.env` файл, де ці значення некоректно оточені лапками, та прибрати manual stripping. Використовувати `z.string().transform(s => s.trim())` в Zod-схемі. |

---

### M-11. `AUTH_SECRET` позначений як `optional()` в env валідації

| | |
|---|---|
| **Файл** | `src/env.js` (рядок 12) |
| **Категорія** | SECURITY |
| **Опис** | `AUTH_SECRET: z.string().min(16).optional()` означає, що додаток може запуститися без секрету автентифікації. NextAuth згенерує нестабільний рандомний ключ, і JWT-сесії будуть інвалідовані при кожному рестарті сервера. |
| **Фікс** | Зробити `AUTH_SECRET` обовʼязковим у production: |

```javascript
AUTH_SECRET: process.env.NODE_ENV === "production"
  ? z.string().min(16)
  : z.string().min(16).optional(),
```

---

### M-12. NavMenu — відсутність keyboard focus trap

| | |
|---|---|
| **Файл** | `src/components/layout/navMenu/navmenu.tsx` |
| **Категорія** | UX / A11Y |
| **Опис** | Випадаюче меню навігації не має focus trap для клавіатурних юзерів. Коли меню відкрите, натискання `Tab` переміщує фокус за межі меню, але візуально воно залишається відкритим. Також відсутня підтримка `Escape` для закриття. |
| **Фікс** | Додати: 1) `onKeyDown` з обробкою `Escape` для закриття; 2) Focus trap (бібліотека `focus-trap-react` або ручне циклічне переміщення фокусу); 3) `aria-expanded` на тригер-кнопці. |

---

### M-13. Відсутність composite-індексу для аналітики

| | |
|---|---|
| **Файл** | `prisma/schema.prisma` (модель `AnalyticsEvent`, рядки 332-352) |
| **Категорія** | PERFORMANCE |
| **Опис** | Адмінська панель аналітики ймовірно фільтрує дані за `createdAt` + `pageType` або `createdAt` + `country`. Окремі індекси на кожне поле менш ефективні за composite-індекс для таких запитів. При зростанні таблиці це стане bottleneck. |
| **Фікс** | Додати composite-індекси: |

```prisma
@@index([createdAt, pageType])
@@index([createdAt, country])
@@index([visitorHash, createdAt])
```

---

## 🟢 LOW — Низький пріоритет

### L-1. ESLint: `no-unused-vars` як warning замість error

| | |
|---|---|
| **Файл** | `eslint.config.js` (рядок 27-29) |
| **Категорія** | CODE_QUALITY |
| **Опис** | `@typescript-eslint/no-unused-vars` встановлений як `"warn"`. Невикористані змінні накопичуються і не блокують CI/CD. |
| **Фікс** | Змінити на `"error"` для суворішого контролю якості коду. |

---

### L-2. `tsconfig.json` — відсутні додаткові strict-опції

| | |
|---|---|
| **Файл** | `tsconfig.json` |
| **Категорія** | CODE_QUALITY |
| **Опис** | Бракує `"noUnusedLocals": true`, `"noUnusedParameters": true`, та `"forceConsistentCasingInFileNames": true`. |
| **Фікс** | Додати у `compilerOptions` для суворішого type-checking. |

---

### L-3. `vitest.config.ts` — environment `node` замість `jsdom`

| | |
|---|---|
| **Файл** | `vitest.config.ts` (рядок 6) |
| **Категорія** | BUG / TESTING |
| **Опис** | Тестове середовище встановлене як `"node"`, але у `package.json` є залежність `jsdom`. Якщо зʼявляться тести UI-компонентів з React, вони будуть падати через відсутність DOM API. Наразі існуючі тести (`analytics-helpers.test.ts`, `parse-id.test.ts`, `sanitize-html.test.ts`) є чисто серверними і працюють, але `sanitize-html.test.ts` тестує DOMPurify, що потребує DOM. |
| **Фікс** | Або змінити на `"jsdom"`, або встановити per-file: |

```typescript
// У файлах тестів, що потребують DOM:
// @vitest-environment jsdom
```

---

### L-4. `getLocalized()` повертає порожній рядок, який не обробляється UI

| | |
|---|---|
| **Файл** | `src/lib/i18n.ts` (рядки 18-37) |
| **Категорія** | UX |
| **Опис** | Якщо і `titleUk`, і базовий `title` порожні в БД, `getLocalized()` повертає `""`. UI-компоненти зазвичай не перевіряють порожній рядок і можуть відображати порожні `<h1>` або `<h2>`, що погіршує SEO та UX. |
| **Фікс** | Або повертати fallback-текст (наприклад, `"[Без назви]"`), або додати NOT NULL constraint на базові поля у Prisma-схемі. |

---

### L-5. `deleteAuthorAction` — fire-and-forget видалення Cloudinary-ассетів

| | |
|---|---|
| **Файл** | `src/app/(admin)/admin/authors/_actions.ts` (рядок 217) |
| **Категорія** | BUG |
| **Опис** | `void Promise.allSettled(deleteTasks)` запускає видалення ассетів з Cloudinary без очікування результату. Якщо сервер зупиниться до завершення — файли залишаться "сиротами" у Cloudinary, займаючи місце та квоту. |
| **Фікс** | Або `await Promise.allSettled(deleteTasks)`, або фонова чергу завдань (background job queue). |

---

### L-6. `logoutAction` — відсутній `requireAdmin()`

| | |
|---|---|
| **Файл** | `src/app/(admin)/admin/_action.ts` (рядки 4-5) |
| **Категорія** | CODE_QUALITY |
| **Опис** | `logoutAction` не перевіряє, чи є юзер авторизованим перед виконанням. Хоча `signOut` сам по собі безпечний, для консистентності з усіма іншими admin actions варто додати guard. |
| **Фікс** | Додати `await requireAdmin()` на початку функції. |

---

### L-7. Missing React.memo у списках — зайві ре-рендери

| | |
|---|---|
| **Файл** | `src/components/gallery/GalleryPosts.tsx`, `src/app/(site)/[locale]/shop/_ShopStorefront.tsx` |
| **Категорія** | PERFORMANCE |
| **Опис** | При `loadMore` / "Показати ще" перерендериться весь список карток, включаючи вже показані. Для галереї з десятками елементів це непотрібні обчислення. |
| **Фікс** | Виділити окрему картку в `React.memo()` компонент: |

```tsx
const PostCard = React.memo(function PostCard({ post }: { post: Post }) {
  // ...рендер картки
});
```

---

## 📊 Зведена статистика

| Severity | Кількість | Категорії |
|----------|-----------|-----------|
| 🔴 CRITICAL | 4 | Security (2), UX (2) |
| 🟠 HIGH | 8 | Performance (4), Security (2), UX (1), SEO (1) |
| 🟡 MEDIUM | 13 | Security (3), UX (3), Performance (3), Bug (2), Code Quality (2) |
| 🟢 LOW | 7 | Code Quality (3), UX (1), Performance (1), Bug (1), Testing (1) |
| **Всього** | **32** | |

---

## ✅ Що зроблено добре

Варто відзначити, що проєкт має солідну базову архітектуру:

- ✅ **Серверна валідація цін** — checkout не довіряє цінам з клієнта, перечитує з БД
- ✅ **Атомарний декремент стоків** — `updateMany WHERE stock >= qty` запобігає від'ємним залишкам
- ✅ **DOMPurify санітизація** — всі `dangerouslySetInnerHTML` обгорнуті `sanitizeHtml()`
- ✅ **`requireAdmin()` guard** — на всіх адмінських Server Actions (крім logout)
- ✅ **Rate limiting** — analytics API та inquiry action мають обмеження
- ✅ **Cloudinary оптимізація** — presets для різних контекстів (thumb, card, large)
- ✅ **Prisma індекси** — продумане індексування для основних запитів
- ✅ **Правильний i18n fallback** — uk → en → key
- ✅ **ISR / revalidation** — сторінки магазину та sitemap з розумними TTL
- ✅ **Dedup для аналітики** — in-memory TTL-cache + visitor hash GDPR-compliant
- ✅ **Decimal → Number** — коректна серіалізація Prisma Decimal через `plainProduct()`
- ✅ **Security headers** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy
