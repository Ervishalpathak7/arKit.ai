import { log } from "@/config/logger.js";
import { Infra } from "../interface.js";
import { Redis as redis } from "ioredis";

export class Redis implements Infra {
  private client: redis;

  constructor(url: string) {
    this.client = new redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: null,
    });

    this.client.on("ready", () => {
      log.info({ type: "Redis" }, "Redis ready");
    });

    this.client.on("error", (error) => {
      log.error({ error, type: "Redis" }, "Redis error");
    });

    this.client.on("reconnecting", () => {
      log.warn({ type: "Redis" }, "Redis reconnecting");
    });

    this.client.on("close", () => {
      log.warn({ type: "Redis" }, "Redis connection closed");
    });
  }

  async connect() {
    await this.client.connect();
    await this.client.ping();
  }

  async disconnect() {
    await this.client.quit();
  }

  getClient() {
    return this.client;
  }

  async healthCheck() {
    const result = await this.client.ping();
    if (result !== "PONG") throw new Error("redis unhealthy");
  }
}
