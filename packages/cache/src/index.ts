import Redis from "ioredis";

let redis: Redis | null = null;

export async function initCache(url: string) {
  const client = new Redis(url, {
    maxRetriesPerRequest: 0,
    lazyConnect: true, // don't auto-connect on construction
  });

  try {
    await client.connect();
    await client.ping();
    redis = client;
  } catch (err) {
    await client.quit();
    throw new Error(`Cache initialization failed: ${(err as Error).message}`);
  }
}

function getRedis(): Redis {
  if (!redis) {
    throw new Error("Cache not initialized. Call initCache() first.");
  }
  return redis;
}

export async function setStatus(jobId: string, status: string) {
  await getRedis().set(`job:${jobId}:status`, status);
}

export async function getStatus(jobId: string) {
  return getRedis().get(`job:${jobId}:status`);
}

export async function setResult(jobId: string, result: unknown) {
  await getRedis().set(
    `job:${jobId}:result`,
    JSON.stringify(result),
    "EX",
    3600,
  );
}

export async function getResult<T>(jobId: string): Promise<T | null> {
  const raw = await getRedis().get(`job:${jobId}:result`);
  if (!raw) return null;
  return JSON.parse(raw) as T;
}
