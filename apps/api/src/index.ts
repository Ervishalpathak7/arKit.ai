import { env } from '@/config/env.js';
import { CreateApp } from '@/app.js';
import { log } from '@/config/logger.js';
import { gracefulShutdown } from '@/utils/shutdown.js';
import { initDb } from '@archiq/db';
import { initCache } from '@archiq/cache';
import { initQueue } from '@archiq/queue';

async function StartServer() {
  // Db intialisation
  await initDb(env.DATABASE_URL);
  log.info(`Database Connected`);

  // Cache initialisation
  await initCache(env.REDIS_URL);
  log.info(`Cache Connected`);

  // Queue Initialisation
  await initQueue(env.RABBITMQ_URL);
  log.info(`Queue Connected`);

  // Server Initialisation
  const app = CreateApp();
  const server = app.listen(env.PORT, () => {
    log.info({ port: env.PORT }, `server started`);
  });

  process.on('SIGTERM', () => {
    console.log('Signal : SIGTERM');
    gracefulShutdown('SIGTERM', server);
  });
  process.on('SIGINT', () => {
    console.log('Signal : SIGINT');
    gracefulShutdown('SIGINT', server);
  });
}

StartServer().catch(error => {
  console.error('the error :', error);
  log.fatal({ error: (error as Error).message }, `Fatal startup error `);
  process.exitCode = 1;
});
