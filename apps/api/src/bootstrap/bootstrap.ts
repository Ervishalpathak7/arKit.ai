import { Infra } from "@/infra/interface.js";
import { Prisma } from "@/infra/prisma/prisma.js";
import { RabbitMQ } from "@/infra/queue/rabbitmq.js";
import { Redis } from "@/infra/redis/redis.js";

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
