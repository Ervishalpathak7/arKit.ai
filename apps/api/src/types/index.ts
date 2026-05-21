import { PrismaClient } from "@/generated/prisma/client.js";
import type { Redis } from "ioredis";

export type IdempotencyRecord = {
  id: string;
  status: "PROCESSING" | "COMPLETED" | "FAILED";
  requestHash: string;
};

export type DesignRouterOptions = {
  prismaClient: PrismaClient;
  redisClient: Redis;
};


export type AppDependencies = {
  prismaClient: PrismaClient;
  redisClient: Redis;
};

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
