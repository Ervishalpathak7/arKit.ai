import { env } from "@/config/env.js";
import { log } from "@/config/logger.js";
import { Redis } from "ioredis";

const connectionString = env.REDIS_URL;

const redisClient = new Redis(connectionString, {
  enableReadyCheck: true,
  lazyConnect: true,
  maxRetriesPerRequest: null,
});
redisClient.on("connect", () => {
  log.info("redis tcp connection established");
});

redisClient.on("ready", () => {
  log.info("redis ready");
});

redisClient.on("error", (error) => {
  log.error({ error }, "redis error");
});

redisClient.on("reconnecting", () => {
  log.warn("redis reconnecting");
});

redisClient.on("close", () => {
  log.warn("redis connection closed");
});

export const connectRedis = async () => {
  if (redisClient.status !== "ready") await redisClient.connect();
  await redisClient.ping();
};

export const disconnectRedis = async () => {
  await redisClient.quit();
};
