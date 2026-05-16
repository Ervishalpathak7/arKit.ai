import { env } from "@/config/env.js";
import { CreateApp } from "./app.js";

async function StartServer() {
  const app = CreateApp();
  const server = app.listen(env.PORT, () => {
    console.log(`Server running on port : ${env.PORT}`);
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
