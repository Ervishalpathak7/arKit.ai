import { env } from "@/config/env.js";
import { CreateApp } from "@/app.js";
import { connectDatabase, disconnectDatabase } from "@/db/prisma.js";
import { connectRedis, disconnectRedis } from "@/db/redis.js";
import { log } from "@/config/logger.js";
import { gracefulShutdown } from "@/utils/shutdown.js";

async function StartServer() {
  // Postgres Connection
  await connectDatabase();
  log.info({ database: "postgres" }, "database connected");

  // Redis Connection
  await connectRedis();
  log.info({ database: "redis" }, "redis connected");

  // Server Initialisation
  const app = CreateApp();
  const server = app.listen(env.PORT, () => {
    log.info(
      { port: env.PORT, url: `http://localhost:${env.PORT}` },
      `Server Started`,
    );
  });

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM", server));
  process.on("SIGINT", () => gracefulShutdown("SIGINT", server));
}

StartServer().catch((error) => {
  log.fatal({ error }, `Fatal startup error `);
  process.exitCode = 1;
});
