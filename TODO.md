# TODO

## Виконано (серпень 2026) — за результатами PROJECT_ANALYSIS.md

- [x] Auth-guard (`requireAdmin`) для всіх admin server actions + `getCloudinarySignature`
- [x] Серверний перерахунок цін, перевірка стоків (`updateMany` guard), zod-валідація в checkout
- [x] Прибрано `ignoreBuildErrors` / `ignoreDuringBuilds` з next.config.js
- [x] Rate limiting: login (5/15 хв), analytics (30/хв), inquiries (5/10 хв)
- [x] Надійна генерація номерів замовлень/запитів (CSPRNG + retry на колізію)
- [x] Валідація числових URL-параметрів на `/art`
- [x] `Decimal(10,2)` для цін + індекси на всіх FK (міграція)
- [x] `/generated` прибрано з git та додано до `.gitignore`
- [x] ISR (`revalidate = 60`) замість `force-dynamic` для `/gallery` і `/shop`
- [x] Транзакції для reorder actions; `Promise.all` у pagination action
- [x] Analytics: HTTPS-only геолокація, FIFO geo-cache, in-memory dedup
- [x] Свіжі дані продуктів у кошику (refetch після hydration)
- [x] Рефакторинг скролу: React-context для Lenis (`LenisProvider` + `useLenis()`) замість window-глобали, виправлено рантайм-баг `win.lenis.start is not a function`
- [x] Sitemap + robots, CI (GitHub Actions), Dockerfile, seed-admin
- [x] Валідація середовища через t3-env (`src/env.js`)
- [x] Виправлено скрипт `db:generate`, додано `db:migrate:dev`, `.env.example` доповнено

## Наступні кроки

- [ ] **i18n:** перехід на route-based локалі `/[locale]` (детальний поетапний план у `PROJECT_ANALYSIS.md`)
- [~] **Тести:** Vitest налаштовано ✅ (18 unit-тестів для i18n/parse-id, крок у CI) · залишилось: integration-тести checkout + Playwright e2e
- [x] **SEO:** JSON-LD structured data — ✅ виконано 2026-08-26 (`JsonLd` компонент: Organization+WebSite на головній, ItemList/VisualArtwork на /art, Product+Offer на /shop/[id], Article на /gallery/[postId])
- [~] **Оптимізація бандла:** ✅ LazyImageCropModal (react-easy-crop) в 12 адмін-формах, `npm run analyze` (@next/bundle-analyzer) · залишилось: розподіл GSAP/Framer при рефакторингу анімацій
