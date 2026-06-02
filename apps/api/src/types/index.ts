import { PrismaClient } from "@archiq/prisma";
import { Prisma } from "@archiq/prisma";
import { RabbitMQ } from "@archiq/queue";
import { Redis, RedisClient } from "@archiq/redis";

export type AppDependencies = {
  prisma: Prisma;
  redis: Redis;
  rabbitMq: RabbitMQ;
};

export type IdempotencyRecord = {
  id: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  requestHash: string;
};

export type DesignRouterOptions = {
  prismaClient: PrismaClient;
  redisClient: RedisClient;
  rabbitMq: RabbitMQ;
};

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
