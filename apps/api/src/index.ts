import { env } from "@/config/env.js";
import { CreateApp } from "./app.js";
import { createAppLogger } from "@archiq/logger";
import { connectDatabase, disconnectDatabase } from "./db/prisma.js";

async function StartServer() {
  const app = CreateApp();
  const log = createAppLogger({
    service: "api",
    production: env.NODE_ENV === "production",
  });

  // Database Connection
  await connectDatabase();
  log.info(`Database Connected`);

  // Server Initialisation
  const server = app.listen(env.PORT, async () => {
    log.info(
      {
        port: env.PORT,
        url: `http://localhost:${env.PORT}`,
      },
      `Server Started`,
    );
  });

  process.on("SIGTERM", async () => {
    await disconnectDatabase();
    log.info(`Database Connected`);
    server.close(() => {
      log.info("SIGTERM — shutting down gracefully");
      process.exitCode = 0;
    });
  });

  process.on("SIGINT", async () => {
    await disconnectDatabase();
    log.info(`Database Connected`);
    server.close(() => {
      log.info("SIGTERM — shutting down gracefully");
      process.exitCode = 0;
    });
  });
}

StartServer().catch((err) => {
  console.error("[server] Fatal startup error", err);
  process.exitCode = 1;
});
