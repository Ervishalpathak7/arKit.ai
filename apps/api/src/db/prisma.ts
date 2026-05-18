import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client.js";
import { env } from "@/config/env.js";

const connectionString = env.DATABASE_URL;

const adapter = new PrismaPg({ connectionString });

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}
export const prisma = global.prisma || new PrismaClient({ adapter });
if (env.NODE_ENV !== "production") global.prisma = prisma;

export const connectDatabase = async () => {
  await prisma.$connect();
  await prisma.$queryRaw`SELECT 1`;
};

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
};
