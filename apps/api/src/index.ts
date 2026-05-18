import { env } from "@/config/env.js";
import { CreateApp } from "@/app.js";
import { connectRedis } from "@/db/redis.js";
import { log } from "@/config/logger.js";
import { gracefulShutdown } from "@/utils/shutdown.js";
import { Bootstrap } from "./bootstrap/bootstrap.js";

async function StartServer() {
  // Bootstrap init
  const bootstrap = new Bootstrap(env.DATABASE_URL);
  await bootstrap.initialise();

  // Redis Connection
  await connectRedis();
  log.info({ database: "redis" }, "redis connected");

  // Server Initialisation
  const app = CreateApp();
  const server = app.listen(env.PORT, () => {
    log.info({ port: env.PORT }, `Server Started`);
  });

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM", server, bootstrap));
  process.on("SIGINT", () => gracefulShutdown("SIGINT", server, bootstrap));
}

StartServer().catch((error) => {
  log.fatal({ error }, `Fatal startup error `);
  process.exitCode = 1;
});
