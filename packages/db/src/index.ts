import { PrismaPg } from "@prisma/adapter-pg";
import {
  DesignStatus,
  PrismaClient,
  Design,
} from "./generated/prisma/client.js";
import { NullableJsonNullValueInput } from "./generated/prisma/internal/prismaNamespace.js";

let prismaClient: PrismaClient | null;

type UpdateOptions = {
  title?: string;
  status?: DesignStatus;
  body?: NullableJsonNullValueInput;
};

type CreateOptions = {
  id: string;
  prompt: string;
  authorId: string;
};

export async function initDb(connectionString: string) {
  const adapter = new PrismaPg({ connectionString });
  prismaClient = new PrismaClient({ adapter });

  try {
    await prismaClient.$connect();
    await prismaClient.$executeRaw`SELECT 1`;
  } catch (err) {
    await prismaClient.$disconnect();
    prismaClient = null;
    throw new Error(`DB initialization failed: ${(err as Error).message}`);
  }
}

function getClient(): PrismaClient {
  if (!prismaClient) {
    throw new Error(
      "DB not initialized. Call initDb() before using db functions.",
    );
  }
  return prismaClient;
}

export async function saveDesign(data: CreateOptions) {
  return getClient().design.create({ data });
}

export async function getDesignById(id: string) {
  return getClient().design.findUnique({ where: { id } });
}

export async function updateDesignById(id: string, data: UpdateOptions) {
  return getClient().design.update({
    where: { id },
    data,
  });
}

export { DesignStatus };
export type { Design };
