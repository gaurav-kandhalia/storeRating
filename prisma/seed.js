// prisma/seed.ts
import { PrismaClient } from '../generated/prisma/index.js ';
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {
      
      name: "Super Admin",
      password: hashedPassword,
      address: "Head Office",
    },
    create: {
      name: "Super Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      address: "Head Office",
      role: "ADMIN",
    },
  });

  console.log("✅ Admin seeded/updated:", admin.email);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
