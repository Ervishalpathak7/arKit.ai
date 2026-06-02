import { Infra } from "@archiq/types";
import { Redis as redis } from "ioredis";

export class Redis implements Infra {
  private client: redis;

  constructor(url: string) {
    this.client = new redis(url, {
      lazyConnect: true,
      maxRetriesPerRequest: null,
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

export { redis as RedisClient };
