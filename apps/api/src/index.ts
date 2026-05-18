import { env } from "@/config/env.js";
import { CreateApp } from "./app.js";
import { createAppLogger } from "@archiq/logger";

async function StartServer() {
  const app = CreateApp();
  const log = createAppLogger({
    service: "api",
    production: env.NODE_ENV === "production",
  });

  const server = app.listen(env.PORT, () => {
    log.info(
      {
        port: env.PORT,
        url: `http://localhost:${env.PORT}`,
      },
      `Server Started`,
    );
  });

  process.on("SIGTERM", () => {
    console.log("[server] SIGTERM — shutting down gracefully");
    server.close(() => {
      process.exitCode = 0;
    });
  });

  process.on("SIGINT", () => {
    console.log("[server] SIGTERM — shutting down gracefully");
    server.close(() => {
      process.exitCode = 0;
    });
  });
}

StartServer().catch((err) => {
  console.error("[server] Fatal startup error", err);
  process.exitCode = 1;
});
