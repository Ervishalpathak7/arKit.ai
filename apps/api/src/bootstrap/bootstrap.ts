import { log } from "@/config/logger.js";
import { Prisma } from "@/infra/prisma/prisma.js";

export class Bootstrap {
  public prismaService: Prisma;

  constructor(postgresConnectionString: string) {
    this.prismaService = new Prisma(postgresConnectionString);
  }

  async initialise() {
    await this.prismaService.connect();
    log.info({ infra: "postgres" }, `Postgres Connected`);
  }

  async shutdown() {
    await this.prismaService.disconnect();
    log.info({ infra: "postgres" }, `Postgres disconnected`);
  }
}
