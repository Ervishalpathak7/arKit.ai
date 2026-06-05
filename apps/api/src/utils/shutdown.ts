import { log } from "@/config/logger.js";
import { dissconnectCache } from "@archiq/cache";
import { dissconnectDb } from "@archiq/db";
import { dissconnectQueue } from "@archiq/queue";
import { Server } from "http";

export const gracefulShutdown = async (signal: string, server: Server) => {
  log.info(`[${signal}] Shutdown initiated`);
  await dissconnectDb();
  await dissconnectCache();
  await dissconnectQueue();
  server.close(() => {
    log.info(`Server Closed`);
    process.exitCode = 0;
  });
};
