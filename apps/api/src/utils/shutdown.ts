import { log } from "@/config/logger.js";
import { disconnectDatabase } from "@/db/prisma.js";
import { disconnectRedis } from "@/db/redis.js";
import { Server } from "http";

export const gracefulShutdown = async (signal: string, server: Server) => {
  log.info(`[${signal}] Shutdown initiated`);
  await disconnectDatabase();
  log.info({ database: "postgres" }, `Database disconnected`);
  await disconnectRedis();
  log.info({ database: "redis" }, `Redis disconnected`);

  server.close(() => {
    log.info(`Server Closed`);
    process.exitCode = 0;
  });
};
