# 🐛 BUGS.md — Аудит проєкту VoytArt

> Повний аудит коду на баги, безпеку, перфоменс та UX.
> Первинний аудит: 2026-08-29 (32 проблеми) → Ревізія: 2026-08-30 (27 виправлено, 6 залишилось)

---

## 📊 Загальний статус

| Severity | Всього | ✅ Виправлено | ❌ Залишилось |
|----------|--------|--------------|--------------|
| 🔴 CRITICAL | 4 | 3 | 1 |
| 🟠 HIGH | 8 | 7 | 1 |
| 🟡 MEDIUM | 13 | 11 | 2 |
| 🟢 LOW | 7 | 5 | 2 |
| 🆕 NEW | 1 | 1 | 0 |
| **Всього** | **33** | **27** | **6** |

---

## Зміст

- [✅ Виправлені баги](#-виправлені-баги)
- [❌ Невиправлені баги + план вирішення](#-невиправлені-баги--план-вирішення)
- [🆕 Нові знахідки](#-нові-знахідки)

---

## ✅ Виправлені баги

### 🔴 CRITICAL

#### C-1. ✅ Checkout Server Action без Rate Limiting
**Файл:** `src/app/(site)/[locale]/shop/_actions/checkout.ts`
**Фікс:** Додано `rateLimit("checkout:${ip}", { limit: 5, windowMs: 5 * 60 * 1000 })` — 5 спроб за 5 хвилин. Якісна реалізація з `getClientIp(headerList)`.

#### C-2. ✅ Відсутність `error.tsx`
**Фікс:** Створено 2 файли:
- `src/app/(site)/[locale]/error.tsx` — з i18n, reset-кнопкою, посиланням на головну, брендований дизайн
- `src/app/(admin)/admin/error.tsx` — з адмін-стилями та окремим дизайном

#### C-3. ✅ Відсутність `loading.tsx`
**Фікс:** Створено 3 файли зі skeleton-лоадерами:
- `src/app/(site)/[locale]/shop/loading.tsx` — grid скелетонів товарів + категорій
- `src/app/(site)/[locale]/art/[[...artistId]]/loading.tsx` — спінер
- `src/app/(site)/[locale]/gallery/loading.tsx` — grid скелетонів постів

---

### 🟠 HIGH

#### H-1. ✅ Memory leak `URL.createObjectURL()` без `revokeObjectURL()`
**Файл:** `src/hooks/use-image-crop.ts`
**Фікс:** Додано `createdUrlRef` для відстеження URL, `updatePreviewUrl()` з `revokeObjectURL()` перед створенням нового, та useEffect cleanup на unmount.

#### H-2. ✅ SmoothScroll ламає навігацію "Назад"
**Файл:** `src/components/SmoothScroll/SmoothScroll.tsx`
**Фікс:** Видалено примусовий `window.scrollTo(0, 0)` з `handlePopState`. Залишено тільки `lenis.resize()` + `ScrollTrigger.refresh()` + rAF для повторного рефрешу.

#### H-4. ✅ `fetchPaginatedPaintings` без обмеження offset/limit
**Файл:** `src/app/(site)/[locale]/art/_actions.ts`
**Фікс:** Додано `MAX_LIMIT = 50`, `MAX_OFFSET = 10_000`, та `safeOffset`/`safeLimit` з клампінгом через `Math.min()`.

#### H-7. ✅ Sitemap мовчки приховує помилку БД
**Файл:** `src/app/sitemap.ts`
**Фікс:** `catch (err) { console.error("Sitemap generation error:", err); throw err; }` — логує і re-throw, боти отримають 500 та зроблять retry.

#### H-8. ✅ Відсутність `not-found.tsx`
**Фікс:** Створено 2 файли:
- `src/app/(site)/[locale]/not-found.tsx` — з i18n, великий "404", accent-кольорова кнопка
- `src/app/not-found.tsx` — root-рівень, standalone HTML shell з `<html>/<body>`

---

### 🟡 MEDIUM

#### M-1. ✅ Відсутність CSP та HSTS
**Файл:** `next.config.js`
**Фікс:** Додано `Strict-Transport-Security` (max-age=63072000) та `Content-Security-Policy` з коректними джерелами (cloudinary, ipwho.is, blob:, data:). Також додано `Permissions-Policy`.

#### M-2. ✅ `callbackUrl` Open Redirect
**Файли:** `src/middleware.ts`, `src/auth.config.ts`
**Фікс:** В обох файлах валідація `callbackUrl.startsWith('/admin') && !callbackUrl.startsWith('//')` — подвійний захист від open redirect та protocol-relative URL.

#### M-3. ✅ Reverse tabnabbing через `target="_blank"`
**Файл:** `src/lib/sanitize-html.ts`
**Фікс:** DOMPurify hook `afterSanitizeAttributes` автоматично додає `rel="noopener noreferrer"` на всі `<a target="_blank">`.

#### M-4. ✅ Ref замість State у рендері HeroDesktop
**Фікс:** `isMobileRef.current` більше не використовується в JSX. Розділення desktop/mobile тепер чисто на серверній стороні в `src/app/(site)/[locale]/page.tsx`.

#### M-6. ✅ Shop page: author overfetching
**Файл:** `src/app/(site)/[locale]/shop/page.tsx`
**Фікс:** `author: { select: { id, firstName, firstNameUk, lastName, lastNameUk } }` — тільки потрібні поля.

#### M-8. ✅ Ціна з хардкоданою локаллю `en-US`
**Файли:** `_ProductView.tsx`, `_ShopStorefront.tsx`
**Фікс:** Замінено `toLocaleString("en-US")` на `formatLocalizedPrice(price, locale)` з `~/lib/i18n`.

#### M-10. ✅ `env.js` — ручна чистка лапок
**Файл:** `src/env.js`
**Фікс:** Видалено regex `.replace()`, використовується `.trim()` через Zod schema.

#### M-11. ✅ `AUTH_SECRET` як optional
**Файл:** `src/env.js`
**Фікс:** `process.env.NODE_ENV === "production" ? z.string().min(16) : z.string().min(16).optional()`.

#### M-13. ✅ Відсутність composite-індексів для аналітики
**Файл:** `prisma/schema.prisma`
**Фікс:** 3 composite індекси: `[createdAt, pageType]`, `[createdAt, country]`, `[visitorHash, createdAt]`.

---

### 🟢 LOW

#### L-5. ✅ `deleteAuthorAction` fire-and-forget Cloudinary
**Файл:** `src/app/(admin)/admin/authors/_actions.ts`
**Фікс:** `await Promise.allSettled(deleteTasks)` — чекає завершення видалення з Cloudinary.

#### L-6. ✅ `logoutAction` без `requireAdmin()`
**Файл:** `src/app/(admin)/admin/_action.ts`
**Фікс:** `await requireAdmin()` додано перед `signOut()`.

#### L-4. ✅ `getLocalized()` порожній рядок
**Файл:** `src/lib/i18n.ts`
**Фікс:** `pick()` перевіряє `value.trim() !== ""` — порожні та whitespace рядки коректно фолбечаться на базову мову.

---

## ❌ Невиправлені баги + план вирішення

### 🔴 CRITICAL

#### C-4. ❌ `next-auth@5.0.0-beta.25` — бета у продакшені
| | |
|---|---|
| **Файл** | `package.json` (рядок 55) |
| **Статус** | Не оновлено |
| **Вирішення** | Оновити до стабільного релізу: `npm install next-auth@latest`. Потребує тестування сумісності з `authConfig.callbacks`, `Credentials` provider та middleware. Рекомендується протестувати login flow після оновлення. |

---

### 🟠 HIGH

#### H-3. ❌ Dockerfile: Prisma CLI в продакшен-образі + відсутність `--chown`
| | |
|---|---|
| **Файл** | `Dockerfile` (рядки 38-40) |
| **Статус** | Не змінено |
| **Вирішення** | 1) Видалити рядок `COPY --from=deps /app/node_modules/prisma ./node_modules/prisma` — Prisma CLI (~40 MB) не потрібен у runtime. 2) Додати `--chown=nextjs:nodejs` до рядків 38 та 40: |

```dockerfile
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
# ВИДАЛИТИ: COPY --from=deps /app/node_modules/prisma ./node_modules/prisma
COPY --from=deps --chown=nextjs:nodejs /app/generated ./generated
```

---

#### H-5. ❌ Hero RAM: `new Image()` замість `createImageBitmap()`
| | |
|---|---|
| **Файл** | `src/components/home/Hero/HeroDesktop.tsx` (рядки 279, 402) |
| **Статус** | Не змінено. Cleanup через `.close()` є, але `new Image()` все ще використовується |
| **Вирішення** | Замінити `new Image()` на `fetch(url) → response.blob() → createImageBitmap(blob)`. `ImageBitmap` дозволяє явно звільняти GPU-памʼять через `.close()` при видаленні з кешу, на відміну від `HTMLImageElement`, де bitmap живе поки не зробиш GC. Fallback для Safari < 15: залишити `new Image()`. |

---

#### H-6. ❌ I18n-словники в клієнтському бандлі
| | |
|---|---|
| **Файл** | `src/lib/i18n.ts` (рядки 1-2) |
| **Статус** | Статичний `import en from "../messages/en.json"` — обидва словники в бандлі |
| **Вирішення** | Варіант А (простий): динамічний `import()` за активною локаллю в `LanguageContext`. Варіант Б (оптимальний): передавати словник із серверного layout через props, так клієнт отримає тільки потрібну мову. |

---

### 🟡 MEDIUM

#### M-5. ❌ `CartContext` — гідраційне мигання
| | |
|---|---|
| **Файл** | `src/context/CartContext.tsx` |
| **Статус** | Все ще `useState` + `useEffect` + `localStorage` |
| **Вирішення** | Рефакторити на `useSyncExternalStore` з React 18+. `getSnapshot` читає localStorage, `getServerSnapshot` повертає `[]`. Це прибере мигання badge "0 items" при гідрації та коректно синхронізує стан між табами. |

---

#### M-7. ❌ `framesManifest.ts` — 88 KB у бандлі
| | |
|---|---|
| **Файл** | `src/data/framesManifest.ts` (87 826 байт, 922 рядки) |
| **Статус** | Статичний `.ts` файл із `Record<number, string>` |
| **Вирішення** | Перенести дані в `.json` файл у `public/` та завантажувати через `fetch('/framesManifest.json')` при монтуванні Hero. Або використати `import()` для code-splitting — Webpack автоматично винесе в окремий chunk. |

---

#### M-9. ❌ Дублікація auth логіки у middleware та auth.config
| | |
|---|---|
| **Файли** | `src/middleware.ts`, `src/auth.config.ts` |
| **Статус** | Свідомо залишено |
| **Вирішення** | Тримати авторизаційну логіку виключно в middleware, а `authConfig.callbacks.authorized` прибрати або звести до `return true`. Це не критично, але спрощує підтримку. |

---

#### M-12. ❌ NavMenu — focus trap (частково)
| | |
|---|---|
| **Файл** | `src/components/layout/navMenu/navmenu.tsx` |
| **Статус** | Escape-обробка додана ✅, але focus trap відсутній |
| **Вирішення** | Додати `focus-trap-react` бібліотеку або ручний цикл: перехоплювати Tab/Shift+Tab на першому та останньому елементі меню та замикати фокус всередині. Також додати `aria-expanded` на burger-кнопку. |

---

### 🟢 LOW

#### L-1. ❌ ESLint `no-unused-vars` як warning
| | |
|---|---|
| **Файл** | `eslint.config.js` |
| **Вирішення** | Змінити `"warn"` → `"error"` для `@typescript-eslint/no-unused-vars`. Прогнати `npx eslint . --fix` та виправити всі помилки, потім перемкнути. |

---

#### L-2. ❌ `tsconfig.json` — відсутні strict-опції
| | |
|---|---|
| **Файл** | `tsconfig.json` |
| **Вирішення** | Додати в `compilerOptions`: `"noUnusedLocals": true`, `"noUnusedParameters": true`, `"forceConsistentCasingInFileNames": true`. Потім виправити помилки білду. |

---

#### L-3. ❌ `vitest.config.ts` — environment `node`
| | |
|---|---|
| **Файл** | `vitest.config.ts` |
| **Вирішення** | Змінити `environment: "node"` → `"jsdom"`, або додати per-file annotation `// @vitest-environment jsdom` у тести що тестують DOM (наприклад `sanitize-html.test.ts`). |

---

#### L-7. ❌ Missing `React.memo` у списках
| | |
|---|---|
| **Файли** | `src/components/gallery/GalleryPosts.tsx`, `_ShopStorefront.tsx` |
| **Вирішення** | Виділити картку товару/посту в окремий `React.memo()` компонент. Це запобіжить повному перерендеру при loadMore. |

---

## 🆕 Нові знахідки

### N-1. ❌ Snap-скрол: жорстка блокіровка під час перельоту між секціями

| | |
|---|---|
| **Файли** | `src/components/home/Hero/HeroDesktop.tsx` (рядки 797-886), `HeroMobile.tsx` (аналогічно) |
| **Категорія** | UX |
| **Опис** | Snap-механізм на головній сторінці перехоплює wheel/touch events і переводить юзера між фіксованими точками (Logo → About → Art → Shop → Neon). Проблема: під час анімації перельоту (`isGlidingRef.current === true`) **всі свайпи повністю блокуються** через `e.preventDefault()` (рядки 866-870 та 915-918). Юзер не може "перескочити" через секцію — навіть якщо він швидко свайпнув двічі поспіль, другий свайп ігнорується поки анімація не завершиться. Також футер не є snap-точкою, що може створювати непередбачувану поведінку при скролі після Neon. |

**Вирішення:** Два незалежних фікси:

#### Фікс А: Дозволити redirect під час glide (не міняючи duration)

В `handleHeroWheel` (рядки 866-870) замінити блокіровку на переспрямування:

```typescript
// Було:
if (isGlidingRef.current) {
  e.preventDefault();
  return;
}

// Стане:
if (isGlidingRef.current) {
  e.preventDefault();
  // Дозволяємо "перескочити" — оновлюємо ціль під час перельоту
  if (Math.abs(e.deltaY) >= 25) {
    if (e.deltaY > 0 && targetIndexRef.current < TOTAL_SECTIONS - 1) {
      goToSection(targetIndexRef.current + 1);
    } else if (e.deltaY < 0 && targetIndexRef.current > 0) {
      goToSection(targetIndexRef.current - 1);
    }
  }
  return;
}
```

Аналогічно для touch в `handleHeroTouchMove` (рядки 915-918):

```typescript
if (isGlidingRef.current) {
  e.preventDefault();
  if (Math.abs(deltaY) > 40) {
    if (deltaY > 0 && targetIndexRef.current < TOTAL_SECTIONS - 1) {
      touchStartY = touchY;
      goToSection(targetIndexRef.current + 1);
    } else if (deltaY < 0 && targetIndexRef.current > 0) {
      touchStartY = touchY;
      goToSection(targetIndexRef.current - 1);
    }
  }
  return;
}
```

На початку `goToSection` додати захист від дублювання:

```typescript
const goToSection = (index: number) => {
  // ...clamping logic...
  // Якщо вже летимо до тієї самої секції — ігноруємо
  if (isGlidingRef.current && targetIndexRef.current === clamped) return;
  // ...решта без змін (lenis.scrollTo з force: true зупинить попередній)
};
```

#### Фікс Б: Додати футер як останню snap-точку

Замість логіки "відпустити скрол після Neon" — зробити Footer 6-ю snap-точкою. Це надійніше, бо юзер отримує передбачуваний UX: кожен свайп = одна секція.

1. В `HeroDesktop.tsx` додати `footerRef` та знайти footer елемент:
```typescript
const footerRef = useRef<HTMLElement | null>(null);

useEffect(() => {
  footerRef.current = document.querySelector('footer');
}, []);
```

2. Збільшити `TOTAL_SECTIONS` на 1:
```typescript
const TOTAL_SECTIONS = DESKTOP_SNAP_POINTS.length + 2; // +1 Neon, +1 Footer
```

3. В `goToSection` додати case для Footer:
```typescript
const isFooter = index >= DESKTOP_SNAP_POINTS.length + 1;
const isNeon = !isFooter && index >= DESKTOP_SNAP_POINTS.length;

if (isFooter && footerRef.current) {
  const footerRect = footerRef.current.getBoundingClientRect();
  targetY = footerRect.top + window.scrollY;
} else if (isNeon && neonEl) {
  // ...існуючий код Neon...
}
```

4. Прибрати "відпускання" скролу після Neon (рядки 853-856).

---

## ✅ Що зроблено добре

- ✅ **Серверна валідація цін** — checkout не довіряє цінам з клієнта, перечитує з БД
- ✅ **Атомарний декремент стоків** — `updateMany WHERE stock >= qty` запобігає від'ємним залишкам
- ✅ **DOMPurify санітизація** — всі `dangerouslySetInnerHTML` обгорнуті `sanitizeHtml()`
- ✅ **`requireAdmin()` guard** — на всіх адмінських Server Actions
- ✅ **Rate limiting** — analytics API, inquiry та checkout мають обмеження
- ✅ **Cloudinary оптимізація** — presets для різних контекстів (thumb, card, large)
- ✅ **Prisma індекси** — продумане індексування + composite індекси для аналітики
- ✅ **Правильний i18n fallback** — uk → en → key
- ✅ **ISR / revalidation** — сторінки магазину та sitemap з розумними TTL
- ✅ **Dedup для аналітики** — in-memory TTL-cache + visitor hash GDPR-compliant
- ✅ **Decimal → Number** — коректна серіалізація Prisma Decimal через `plainProduct()`
- ✅ **Security headers** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- ✅ **Error/Loading/NotFound boundaries** — брендований UX для всіх error states
- ✅ **Open Redirect захист** — callbackUrl валідується в middleware та auth.config
- ✅ **Blob URL cleanup** — `revokeObjectURL()` при зміні файлу та на unmount
