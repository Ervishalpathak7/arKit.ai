import { log } from "@/config/logger.js";
import { Server } from "http";

export const gracefulShutdown = async (signal: string, server: Server) => {
  log.info(`[${signal}] Shutdown initiated`);
  server.close(() => {
    log.info(`Server Closed`);
    process.exitCode = 0;
  });
};
