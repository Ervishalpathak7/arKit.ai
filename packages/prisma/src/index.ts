import { PrismaPg } from "@prisma/adapter-pg";
import { Infra } from "@archiq/types";
import {
  PrismaClient,
  Design,
  User,
  DesignStatus,
  Plan,
  Prisma as prisma,
} from "./generated/prisma/client.js";

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

export { PrismaClient, DesignStatus, Plan };
export type { Design, User };
export type InputJsonValue = prisma.InputJsonValue;
