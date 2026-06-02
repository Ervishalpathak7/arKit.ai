import { log } from "@/config/logger.js";
import { Prisma } from "@archiq/prisma";
import { RabbitMQ } from "@archiq/queue";
import { Redis } from "@archiq/redis";
import { Infra } from "@archiq/types";

type BootstrapOptions = {
  postgresUrl: string;
  redisUrl: string;
  rabbitMqUrl: string;
};

export class Bootstrap {
  private readonly infra: Infra[];
  public prisma: Prisma;
  public redis: Redis;
  public rabbitMq: RabbitMQ;

  constructor({ postgresUrl, redisUrl, rabbitMqUrl }: BootstrapOptions) {
    this.prisma = new Prisma(postgresUrl);
    this.redis = new Redis(redisUrl);
    this.rabbitMq = new RabbitMQ(rabbitMqUrl);
    this.infra = [this.prisma, this.redis, this.rabbitMq];
  }

  async initialise() {
    for (const service of this.infra) {
      await service.connect();
      log.info(
        { type: service.constructor.name },
        `${service.constructor.name} : connected`,
      );
    }
  }

  async shutdown() {
    for (const service of this.infra.reverse()) {
      await service.disconnect();
      log.warn(
        { type: service.constructor.name },
        `${service.constructor.name} : disconnected`,
      );
    }
  }

  async healthCheck() {
    for (const service of this.infra) {
      await service.healthCheck();
    }
  }
}
