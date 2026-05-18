import { Bootstrap } from "@/bootstrap/bootstrap.js";
import { log } from "@/config/logger.js";
import { Server } from "http";

export const gracefulShutdown = async (signal: string, server: Server , bootstrap : Bootstrap) => {
  log.info(`[${signal}] Shutdown initiated`);
  await bootstrap.shutdown()

  server.close(() => {
    log.info(`Server Closed`);
    process.exitCode = 0;
  });
};
