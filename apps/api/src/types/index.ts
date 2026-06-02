import { PrismaClient } from "@archiq/prisma";
import { Prisma } from "@archiq/prisma";
import { RabbitMQ } from "@/infra/queue/rabbitmq.js";
import { Redis } from "@/infra/redis/redis.js";
import type { Redis as redisClient } from "ioredis";

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
  redisClient: redisClient;
  rabbitMq: RabbitMQ;
};

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
