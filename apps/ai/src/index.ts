if (process.env.NODE_ENV !== "production") {
  const { config } = await import("dotenv");
  config();
}

import { initDb } from "@archiq/db";
import { initCache } from "@archiq/cache";
import { initQueue } from "@archiq/queue";
import { startWorker } from "./worker.js";
import { log } from "./logger.js";

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  const redisUrl = process.env.REDIS_URL;
  const rabbitUrl = process.env.RABBITMQ_URL;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!dbUrl) throw new Error("DATABASE_URL is not set");
  if (!redisUrl) throw new Error("REDIS_URL is not set");
  if (!rabbitUrl) throw new Error("RABBITMQ_URL is not set");
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY is not set");

  await initDb(dbUrl);
  await initCache(redisUrl);
  await initQueue(rabbitUrl);

  await startWorker();
}

main().catch((err) => {
  log.error({ service: "ai" }, "Worker failed to start:", err);
  process.exit(1);
});
