import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/index.js";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Оновлюємо тестові товари реальними фотографіями високої якості...");

  // 1. Отримуємо або створюємо авторів
  let authors = await prisma.author.findMany({ where: { active: true } });
  if (authors.length === 0) {
    const author1 = await prisma.author.create({
      data: {
        firstName: "Ivanka",
        lastName: "Voytovych",
        bio: "Ukrainian contemporary artist.",
        shortDesc: "Painting, graphics, contemporary art",
        order: 1,
        active: true,
      },
    });
    const author2 = await prisma.author.create({
      data: {
        firstName: "Oleksandr",
        lastName: "Voytovych",
        bio: "Ukrainian contemporary artist.",
        shortDesc: "Expressionism, figurative art",
        order: 2,
        active: true,
      },
    });
    authors = [author1, author2];
  }

  const ivanka = authors[0];
  const oleksandr = authors.length > 1 ? authors[1] : authors[0];

  // 2. Створюємо або оновлюємо категорії
  const categoriesData = [
    { name: "Принти та Постери", slug: "prints-posters" },
    { name: "Мерч та Одяг", slug: "merch-apparel" },
    { name: "Кераміка та Арт-об'єкти", slug: "ceramics-art-objects" },
    { name: "Оригінальні Роботи", slug: "original-art" },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: { name: cat.name, slug: cat.slug },
    });
    categories[cat.slug] = record;
  }

  console.log("✅ Категорії підготовлено.");

  // 3. Список товарів з реальними естетичними фото з Unsplash
  const sampleProducts = [
    {
      title: "Fine Art Print «Ethereal Geometry»",
      description:
        "<p>Лімітований музейний принт на бавовняному папері Hahnemühle 310 gsm. Кожен екземпляр підписаний авторкою вручну та має сертифікат автентичності.</p>",
      price: 950,
      stock: 35,
      isFeatured: true,
      isActive: true,
      coverUrl: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
      categoryId: categories["prints-posters"].id,
      authorId: ivanka.id,
      variants: [
        { title: "A3 (30 × 42 см) — без рами", price: 950, stock: 20, sku: "PR-EG-A3" },
        { title: "A2 (42 × 59 см) — без рами", price: 1450, stock: 10, sku: "PR-EG-A2" },
        { title: "A2 в чорній дубовій рамі", price: 2350, stock: 5, sku: "PR-EG-A2-FRAME" },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80", order: 0 },
        { url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80", order: 1 },
      ],
    },
    {
      title: "Оверсайз худі «Dark Harmony»",
      description:
        "<p>Преміальний оверсайз худі зі щільної 3-ниткової бавовни (420 gsm). Шовкотрафаретний авторський друк, довговічні стійкі пігменти.</p>",
      price: 2400,
      stock: 24,
      isFeatured: true,
      isActive: true,
      coverUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80",
      categoryId: categories["merch-apparel"].id,
      authorId: oleksandr.id,
      variants: [
        { title: "Розмір S (Oversize)", price: 2400, stock: 6, sku: "HD-DH-S" },
        { title: "Розмір M (Oversize)", price: 2400, stock: 10, sku: "HD-DH-M" },
        { title: "Розмір L (Oversize)", price: 2400, stock: 8, sku: "HD-DH-L" },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80", order: 0 },
        { url: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1200&q=80", order: 1 },
      ],
    },
    {
      title: "Керамічна скульптурна ваза «Eclipse»",
      description:
        "<p>Авторська кераміка ручної ліпки. Матова чорна глазур з фактурним теракотовим градієнтом. Створено в єдиному екземплярі.</p>",
      price: 3800,
      stock: 4,
      isFeatured: true,
      isActive: true,
      coverUrl: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80",
      categoryId: categories["ceramics-art-objects"].id,
      authorId: ivanka.id,
      variants: [
        { title: "Matte Black (28 см)", price: 3800, stock: 2, sku: "VA-EC-BLK" },
        { title: "Raw Terracotta (28 см)", price: 3800, stock: 2, sku: "VA-EC-TER" },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=1200&q=80", order: 0 },
        { url: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1200&q=80", order: 1 },
      ],
    },
    {
      title: "Шовкова хустка «Voyt Symphony»",
      description:
        "<p>100% натуральний шовк твіл з ручною підрубкою країв (hand-rolled edges). Яскравий авторський патерн за мотивами виставкових полотен.</p>",
      price: 1850,
      stock: 18,
      isFeatured: false,
      isActive: true,
      coverUrl: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1200&q=80",
      categoryId: categories["merch-apparel"].id,
      authorId: oleksandr.id,
      variants: [
        { title: "Формат 70 × 70 см", price: 1850, stock: 12, sku: "SC-VS-70" },
        { title: "Формат 90 × 90 см", price: 2350, stock: 6, sku: "SC-VS-90" },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=1200&q=80", order: 0 },
        { url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80", order: 1 },
      ],
    },
    {
      title: "Арт-постер «Abstract Fluidity»",
      description:
        "<p>Шовкодрук у 5 кольорів на дизайнерському картоні Fedrigoni. Ексклюзивний реліз до персональної виставки.</p>",
      price: 1200,
      stock: 50,
      isFeatured: false,
      isActive: true,
      coverUrl: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80",
      categoryId: categories["prints-posters"].id,
      authorId: ivanka.id,
      variants: [
        { title: "50 × 70 см (Без рами)", price: 1200, stock: 35, sku: "PR-AF-50" },
        { title: "50 × 70 см (Алюмінієва рама)", price: 2100, stock: 15, sku: "PR-AF-50-ALU" },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80", order: 0 },
        { url: "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=1200&q=80", order: 1 },
      ],
    },
    {
      title: "Оригінальне полотно «Midnight Mirage»",
      description:
        "<p>Оригінальна авторська робота. Полотно, олія, акрил, змішана техніка (100 × 120 см). Готова до експонування, галерейна натяжка.</p>",
      price: 28000,
      stock: 1,
      isFeatured: true,
      isActive: true,
      coverUrl: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=80",
      categoryId: categories["original-art"].id,
      authorId: oleksandr.id,
      variants: [
        { title: "Оригінал (100 × 120 см)", price: 28000, stock: 1, sku: "ART-MM-ORIG" },
      ],
      images: [
        { url: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=80", order: 0 },
      ],
    },
  ];

  // 4. Очищення старих тестових товарів і запис нових
  const productTitles = sampleProducts.map((p) => p.title);
  // Також видаляємо попередні старі назви якщо були
  const oldTitles = [
    "Оверсайз худі «Neon Horizon»",
    "Арт-постер «Metamorphosis IV»",
    "Керамічна скульптурна ваза «Vortex»",
  ];
  
  await prisma.product.deleteMany({
    where: {
      title: { in: [...productTitles, ...oldTitles] },
    },
  });
  console.log("🧹 Старі тестові товари очищено.");

  for (const prod of sampleProducts) {
    const created = await prisma.product.create({
      data: {
        title: prod.title,
        description: prod.description,
        price: prod.price,
        stock: prod.stock,
        isFeatured: prod.isFeatured,
        isActive: prod.isActive,
        coverUrl: prod.coverUrl,
        categoryId: prod.categoryId,
        authorId: prod.authorId,
        variants: {
          create: prod.variants.map((v, i) => ({
            title: v.title,
            price: v.price,
            stock: v.stock,
            sku: v.sku,
            sortOrder: i,
          })),
        },
        images: {
          create: prod.images.map((img) => ({
            url: img.url,
            order: img.order,
          })),
        },
      },
    });

    console.log(`+ Створено товар «${created.title}» (${prod.variants.length} варіацій, ${prod.images.length} фото).`);
  }

  console.log("🎉 Готово! Магазин оновлено красивими реальними фотографіями.");
}

main()
  .catch((e) => {
    console.error("❌ Помилка під час наповнення:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
