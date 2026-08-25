/**
 * Створює початкового адмін-користувача: `npm run db:seed:admin`
 * Використовує ADMIN_EMAIL / ADMIN_PASSWORD з .env або значення за замовчуванням.
 */
import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@voyt.art").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || crypto.randomUUID();
  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin user ${email} already exists — updating password.`);
    await prisma.adminUser.update({ where: { email }, data: { passwordHash } });
  } else {
    await prisma.adminUser.create({ data: { email, passwordHash } });
    console.log(`Admin user created: ${email}`);
  }

  if (!process.env.ADMIN_PASSWORD) {
    console.log(`\nGenerated temporary password:\n${password}\n`);
    console.log("Збережіть його зараз — він більше не буде показаний.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
