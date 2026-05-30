import { env } from "@/config/env.js";
import { CreateApp } from "@/app.js";
import { log } from "@/config/logger.js";
import { gracefulShutdown } from "@/utils/shutdown.js";
import { Bootstrap } from "./bootstrap/bootstrap.js";

async function StartServer() {
  // Bootstrap init
  const bootstrap = new Bootstrap({
    postgresUrl: env.DATABASE_URL,
    redisUrl: env.REDIS_URL,
    rabbitMqUrl: env.RABBITMQ_URL,
  });
  await bootstrap.initialise();

  // Server Initialisation
  const prisma = bootstrap.prisma;
  const redis = bootstrap.redis;
  const rabbitMq = bootstrap.rabbitMq;

  const app = CreateApp({ prisma, redis, rabbitMq });
  const server = app.listen(env.PORT, () => {
    log.info({ port: env.PORT }, `server started`);
  });

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM", server, bootstrap));
  process.on("SIGINT", () => gracefulShutdown("SIGINT", server, bootstrap));
}

StartServer().catch((error) => {
  log.fatal({ error }, `Fatal startup error `);
  process.exitCode = 1;
});
