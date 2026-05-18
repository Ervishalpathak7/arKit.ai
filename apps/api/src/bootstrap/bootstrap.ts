import { log } from "@/config/logger.js";
import { Prisma } from "@/infra/prisma/prisma.js";
import { Redis } from "@/infra/redis/redis.js";

export class Bootstrap {
  public prismaService: Prisma;
  public redisService: Redis;

  constructor(postgresUrl: string, redisUrl: string) {
    this.prismaService = new Prisma(postgresUrl);
    this.redisService = new Redis(redisUrl);
  }

  async initialise() {
    await this.prismaService.connect();
    log.info({ infra: "postgres" }, `postgres connected`);
    await this.redisService.connect();
    log.info({ infra: "redis" }, `redis connected`);
  }

  async shutdown() {
    await this.prismaService.disconnect();
    log.info({ infra: "postgres" }, `postgres disconnected`);
    await this.redisService.disconnect();
    log.info({ infra: "redis" }, `redis disconnected`);
  }
}
