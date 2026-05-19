import { log } from "@/config/logger.js";
import { Infra } from "../interface.js";
import { Redis as redis } from "ioredis";

export class Redis implements Infra {
  public client: redis;

  constructor(url: string) {
    this.client = new redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: null,
    });

    this.client.on("connect", () => {
      log.info({ infra: "redis" }, `redis connected`);
    });

    this.client.on("ready", () => {
      log.info({ infra: "redis" }, "redis ready");
    });

    this.client.on("error", (error) => {
      log.error({ error, infra: "redis" }, "redis error");
    });

    this.client.on("reconnecting", () => {
      log.warn({ infra: "redis" }, "redis reconnecting");
    });

    this.client.on("close", () => {
      log.warn({ infra: "redis" }, "redis connection closed");
    });
  }

  async connect() {
    await this.client.connect();
    await this.client.ping();
  }

  async disconnect() {
    await this.client.quit();
    log.info({ infra: "redis" }, `redis disconnected`);
  }

  async healthCheck() {
    const result = await this.client.ping();
    if (result !== "PONG") throw new Error("redis unhealthy");
  }
}
