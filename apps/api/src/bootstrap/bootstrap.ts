import { log } from "@/config/logger.js";
import { Prisma } from "@/infra/prisma/prisma.js";
import { RabbitMQ } from "@/infra/queue/rabbitmq.js";
import { Redis } from "@/infra/redis/redis.js";

type BootstrapOptions = {
  postgresUrl: string;
  redisUrl: string;
  rabbitMqUrl: string;
};

export class Bootstrap {
  public prisma: Prisma;
  public redis: Redis;
  public rabbitMQ: RabbitMQ;

  constructor({ postgresUrl, redisUrl, rabbitMqUrl }: BootstrapOptions) {
    this.prisma = new Prisma(postgresUrl);
    this.redis = new Redis(redisUrl);
    this.rabbitMQ = new RabbitMQ(rabbitMqUrl);
  }

  async initialise() {
    await this.prisma.connect();
    log.info({ infra: "postgres" }, `postgres connected`);
    await this.redis.connect();
    log.info({ infra: "redis" }, `redis connected`);
    await this.rabbitMQ.connect();
    log.info({ infra: "rabbitmq" }, `rabbitmq connected`);
  }

  async shutdown() {
    await this.prisma.disconnect();
    log.info({ infra: "postgres" }, `postgres disconnected`);
    await this.redis.disconnect();
    log.info({ infra: "redis" }, `redis disconnected`);
    await this.rabbitMQ.disconnect();
    log.info({ infra: "rabbitmq" }, `rabbitmq disconnected`);
  }
}
