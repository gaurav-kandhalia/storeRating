// import { PrismaClient } from '@prisma/client';
import { PrismaClient } from '../../generated/prisma/index.js';
const prisma = new PrismaClient();
export default prisma;


export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed", error);
    process.exit(1); 
  }
};
