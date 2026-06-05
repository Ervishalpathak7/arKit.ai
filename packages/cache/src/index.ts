import Redis from "ioredis";

let redis: Redis | null;

export async function initCache(url: string) {
  try {
    redis = new Redis(url);
    await redis.ping();
  } catch (err) {
    redis = null;
    throw new Error(`Redis initialisation failed : ${(err as Error).message}`);
  }
}

function getRedis() {
  if (!redis) {
    throw new Error("Redis is not initialised , call initCache() first.");
  }
  return redis;
}

export async function setStatus(jobId: string, status: string) {
  await getRedis().set(`job:${jobId}:status`, status);
}

export async function getStatus(jobId: string) {
  return getRedis().get(`job:${jobId}:status`);
}

export async function setResult(jobId: string, result: string) {
  await getRedis().set(`job:${jobId}:result`, result, "EX", 3600);
}

export { redis as RedisClient };
