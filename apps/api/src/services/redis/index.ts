import { IdempotencyRecord } from "@/types/index.js";
import { Redis } from "ioredis";

const DEFAULT_IDEMPOTANCY_KEY_DURATION = 300;

export class RedisService {
  constructor(private redisClient: Redis) {}

  setIdempotencyKey = async (key: string, payload: IdempotencyRecord) => {
    return this.redisClient.set(
      key,
      JSON.stringify(payload),
      "EX",
      DEFAULT_IDEMPOTANCY_KEY_DURATION,
      "NX",
    );
  };

  setData = async (key: string, data: string, exp: number) => {
    return this.redisClient.set(key, data, "EX", exp);
  };

  getSavedData = async (key: string) => {
    return this.redisClient.get(key);
  };

  deleteData = async (key: string) => {
    return this.redisClient.unlink(key);
  };
}
