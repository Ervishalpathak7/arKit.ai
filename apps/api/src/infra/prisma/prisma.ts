import { PrismaClient } from "@/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

export class Prisma {
  public client: PrismaClient;
  
  constructor(connectionString: string) {
    const adapter = new PrismaPg({ connectionString });
    this.client = new PrismaClient({ adapter });
  }

  async connect() {
    await this.client.$connect();
    await this.client.$queryRaw`SELECT 1`;
  }

  async disconnect() {
    await this.client.$disconnect();
  }
}
