import { log } from '@/config/logger.js';
import { dissconnectCache } from '@archiq/cache';
import { disconnectDb } from '@archiq/db';
import { dissconnectQueue } from '@archiq/queue';
import { Server } from 'http';

let shutdown = false;

export const gracefulShutdown = async (signal: string, server: Server) => {
  log.info(`[${signal}] Shutdown initiated`);

  if (shutdown === true) return;
  shutdown = true;

  await disconnectDb();
  log.warn(`database disconnected`);

  await dissconnectCache();
  log.warn(`queue disconnected`);

  await dissconnectQueue();
  log.warn(`cache disconnected`);

  server.close(() => {
    log.warn(`Server Closed`);
    process.exitCode = 0;
  });
};
