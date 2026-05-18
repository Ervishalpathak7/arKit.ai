import { log } from "@/config/logger.js";
import { Prisma } from "@/infra/prisma/prisma.js";
import { RabbitMQ } from "@/infra/queue/rabbitmq.js";
import { Redis } from "@/infra/redis/redis.js";
import { Infra } from "@/interface/infra.js";

type BootstrapOptions = {
  postgresUrl: string;
  redisUrl: string;
  rabbitMqUrl: string;
};

export class Bootstrap {
  private readonly infra: Infra[];

  constructor({ postgresUrl, redisUrl, rabbitMqUrl }: BootstrapOptions) {
    this.infra = [
      new Prisma(postgresUrl),
      new Redis(redisUrl),
      new RabbitMQ(rabbitMqUrl),
    ];
  }

  async initialise() {
    for (const service of this.infra) {
      await service.connect();
    }
  }

  async shutdown() {
    for (const service of this.infra.reverse()) {
      await service.disconnect();
    }
  }

  async healthCheck() {
    for (const service of this.infra) {
      await service.healthCheck();
    }
  }
}
