import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/index.js";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Починаємо наповнення тестовими товарами для магазину...");

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

  // 3. Тестові товари з варіаціями та фото
  const sampleProducts = [
    {
      title: "Fine Art Print «Ethereal Geometry»",
      description:
        "<p>Лімітований музейний принт на бавовняному папері Hahnemühle 310 gsm. Кожен екземпляр підписаний авторкою вручну та має сертифікат автентичності.</p>",
      price: 950,
      stock: 35,
      isFeatured: true,
      isActive: true,
      coverUrl: "https://res.cloudinary.com/dkm5vtfyg/image/upload/v1787041226/frame_0001_oy1u9x.webp",
      coverPublicId: "voytart/shop/sample_print_1",
      categoryId: categories["prints-posters"].id,
      authorId: ivanka.id,
      variants: [
        { title: "A3 (30 × 42 см) — без рами", price: 950, stock: 20, sku: "PR-EG-A3" },
        { title: "A2 (42 × 59 см) — без рами", price: 1450, stock: 10, sku: "PR-EG-A2" },
        { title: "A2 в чорній дубовій рамі", price: 2350, stock: 5, sku: "PR-EG-A2-FRAME" },
      ],
      images: [
        { url: "https://res.cloudinary.com/dkm5vtfyg/image/upload/v1787041226/frame_0001_oy1u9x.webp", order: 0 },
        { url: "https://res.cloudinary.com/dkm5vtfyg/image/upload/v1787041226/frame_0010_p0jrqe.webp", order: 1 },
      ],
    },
    {
      title: "Оверсайз худі «Neon Horizon»",
      description:
        "<p>Преміальний оверсайз худі зі щільної 3-ниткової бавовни (420 gsm). Шовкотрафаретний друк з неоновими пігментами, що світяться під ультрафіолетом.</p>",
      price: 2400,
      stock: 24,
      isFeatured: true,
      isActive: true,
      coverUrl: "https://res.cloudinary.com/dkm5vtfyg/image/upload/v1787041226/frame_0050_qwmqre.webp",
      coverPublicId: "voytart/shop/sample_hoodie_1",
      categoryId: categories["merch-apparel"].id,
      authorId: oleksandr.id,
      variants: [
        { title: "Розмір S (Oversize)", price: 2400, stock: 6, sku: "HD-NH-S" },
        { title: "Розмір M (Oversize)", price: 2400, stock: 10, sku: "HD-NH-M" },
        { title: "Розмір L (Oversize)", price: 2400, stock: 8, sku: "HD-NH-L" },
      ],
      images: [
        { url: "https://res.cloudinary.com/dkm5vtfyg/image/upload/v1787041226/frame_0050_qwmqre.webp", order: 0 },
        { url: "https://res.cloudinary.com/dkm5vtfyg/image/upload/v1787041226/frame_0060_abcdef.webp", order: 1 },
      ],
    },
    {
      title: "Керамічна скульптурна ваза «Vortex»",
      description:
        "<p>Авторська кераміка ручної ліпки. Матова чорна глазур з фактурним теракотовим градієнтом. Створено в єдиному тиражі.</p>",
      price: 3800,
      stock: 4,
      isFeatured: true,
      isActive: true,
      coverUrl: "https://res.cloudinary.com/dkm5vtfyg/image/upload/v1787041226/frame_0100_zxcvbn.webp",
      coverPublicId: "voytart/shop/sample_vase_1",
      categoryId: categories["ceramics-art-objects"].id,
      authorId: ivanka.id,
      variants: [
        { title: "Matte Black (28 см)", price: 3800, stock: 2, sku: "VA-VT-BLK" },
        { title: "Raw Terracotta (28 см)", price: 3800, stock: 2, sku: "VA-VT-TER" },
      ],
      images: [
        { url: "https://res.cloudinary.com/dkm5vtfyg/image/upload/v1787041226/frame_0100_zxcvbn.webp", order: 0 },
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
      coverUrl: "https://res.cloudinary.com/dkm5vtfyg/image/upload/v1787041226/frame_0150_lkjhgf.webp",
      coverPublicId: "voytart/shop/sample_scarf_1",
      categoryId: categories["merch-apparel"].id,
      authorId: oleksandr.id,
      variants: [
        { title: "Формат 70 × 70 см", price: 1850, stock: 12, sku: "SC-VS-70" },
        { title: "Формат 90 × 90 см", price: 2350, stock: 6, sku: "SC-VS-90" },
      ],
      images: [
        { url: "https://res.cloudinary.com/dkm5vtfyg/image/upload/v1787041226/frame_0150_lkjhgf.webp", order: 0 },
      ],
    },
    {
      title: "Арт-постер «Metamorphosis IV»",
      description:
        "<p>Шовкодрук у 5 кольорів на дизайнерському картоні Fedrigoni. Ексклюзивний реліз до персональної виставки.</p>",
      price: 1200,
      stock: 50,
      isFeatured: false,
      isActive: true,
      coverUrl: "https://res.cloudinary.com/dkm5vtfyg/image/upload/v1787041226/frame_0200_asdfgh.webp",
      coverPublicId: "voytart/shop/sample_print_2",
      categoryId: categories["prints-posters"].id,
      authorId: ivanka.id,
      variants: [
        { title: "50 × 70 см (Без рами)", price: 1200, stock: 35, sku: "PR-MM-50" },
        { title: "50 × 70 см (Мінімалістична алюмінієва рама)", price: 2100, stock: 15, sku: "PR-MM-50-ALU" },
      ],
      images: [
        { url: "https://res.cloudinary.com/dkm5vtfyg/image/upload/v1787041226/frame_0200_asdfgh.webp", order: 0 },
      ],
    },
  ];

  for (const prod of sampleProducts) {
    const existing = await prisma.product.findFirst({
      where: { title: prod.title },
    });

    if (existing) {
      console.log(`- Товар «${prod.title}» вже існує, пропускаємо.`);
      continue;
    }

    const created = await prisma.product.create({
      data: {
        title: prod.title,
        description: prod.description,
        price: prod.price,
        stock: prod.stock,
        isFeatured: prod.isFeatured,
        isActive: prod.isActive,
        coverUrl: prod.coverUrl,
        coverPublicId: prod.coverPublicId,
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

    console.log(`+ Створено товар «${created.title}» з ${prod.variants.length} варіаціями.`);
  }

  console.log("🎉 Готово! Магазин успішно наповнено тестовими даними.");
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
