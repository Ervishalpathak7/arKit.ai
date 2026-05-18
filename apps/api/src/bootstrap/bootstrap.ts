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
  public prismaService: Prisma;
  public redisService: Redis;
  public rabbitMQService: RabbitMQ;

  constructor({ postgresUrl, redisUrl, rabbitMqUrl }: BootstrapOptions) {
    this.prismaService = new Prisma(postgresUrl);
    this.redisService = new Redis(redisUrl);
    this.rabbitMQService = new RabbitMQ(rabbitMqUrl);
  }

  async initialise() {
    await this.prismaService.connect();
    log.info({ infra: "postgres" }, `postgres connected`);
    await this.redisService.connect();
    log.info({ infra: "redis" }, `redis connected`);
    await this.rabbitMQService.connect();
    log.info({ infra: "rabbitmq" }, `rabbitmq connected`);
  }

  async shutdown() {
    await this.prismaService.disconnect();
    log.info({ infra: "postgres" }, `postgres disconnected`);
    await this.redisService.disconnect();
    log.info({ infra: "redis" }, `redis disconnected`);
    await this.rabbitMQService.disconnect();
    log.info({ infra: "rabbitmq" }, `rabbitmq disconnected`);
  }
}
