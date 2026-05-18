import { log } from "@/config/logger.js";
import { Redis as redis } from "ioredis";

export class Redis {
  public client: redis;

  constructor(url: string) {
    this.client = new redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: null,
    });

    this.client.on("ready", () => {
      log.info("redis ready");
    });

    this.client.on("error", (error) => {
      log.error({ error }, "redis error");
    });

    this.client.on("reconnecting", () => {
      log.warn("redis reconnecting");
    });

    this.client.on("close", () => {
      log.warn("redis connection closed");
    });
  }

  async connect() {
    await this.client.connect();
    await this.client.ping();
  }

  async disconnect() {
    await this.client.quit();
  }
}
