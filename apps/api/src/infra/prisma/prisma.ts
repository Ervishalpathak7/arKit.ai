import { PrismaClient } from "@/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Infra } from "../interface.js";

export class Prisma implements Infra {
  private client: PrismaClient;

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

  getClient() {
    return this.client;
  }

  async healthCheck() {
    await this.client.$queryRaw`SELECT 1`;
  }
}
