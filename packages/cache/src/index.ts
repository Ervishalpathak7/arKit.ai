import Redis from "ioredis";
import { DesignStatus } from "@archiq/db";

let redis: Redis | null = null;
let subs: Redis | null = null;
const DEFAULT_IDEMPOTANCY_KEY_DURATION = 300;

export type IdempotencyRecord = {
  id: string;
  status: DesignStatus;
  requestHash: string;
};

export async function initCache(url: string) {
  const Cacheclient = new Redis(url, {
    maxRetriesPerRequest: 0,
    lazyConnect: true, // don't auto-connect on construction
  });

  const subscribeClient = new Redis(url, {
    maxRetriesPerRequest: 0,
    lazyConnect: true,
  });

  try {
    await Cacheclient.connect();
    await subscribeClient.connect();
    await Cacheclient.ping();
    await subscribeClient.ping();
    redis = Cacheclient;
    subs = subscribeClient;
  } catch (err) {
    await Cacheclient.quit();
    await subscribeClient.quit();
    throw new Error(`Cache initialization failed: ${(err as Error).message}`);
  }
}

export async function dissconnectCache() {
  await getRedis().quit();
  redis = null;
}
function getRedis(): Redis {
  if (!redis) {
    throw new Error("Cache not initialized. Call initCache() first.");
  }
  return redis;
}

function getSubscribe() {
  if (!subs) {
    throw new Error("Subscribe client not initialized. call initCache() first");
  }
  return subs;
}

export async function publish(channel: string, data: unknown) {
  await getRedis().publish(channel, JSON.stringify(data));
}

export async function subscribe(
  channel: string,
  handler: (data: string) => void,
) {
  const sub = getSubscribe();
  await sub.subscribe(channel);
  sub.on("data", (ch, data) => {
    if (ch !== channel) return;
    handler(data);
  });
}

export async function setStatus(jobId: string, status: DesignStatus) {
  await getRedis().set(`job:${jobId}:status`, status);
}

export async function getStatus(jobId: string) {
  return getRedis().get(`job:${jobId}:status`);
}

export async function setResult(jobId: string, result: string) {
  await getRedis().set(`job:${jobId}:result`, result, "EX", 3600);
}

export async function getResult<T>(jobId: string): Promise<T | null> {
  const raw = await getRedis().get(`job:${jobId}:result`);
  if (!raw) return null;
  return JSON.parse(raw) as T;
}

export async function setIdempotencyKey(
  authorId: string,
  idempotencyKey: string,
  payload: IdempotencyRecord,
) {
  const redisKey = `idem:${authorId}:${idempotencyKey}`;
  return getRedis().set(
    redisKey,
    JSON.stringify(payload),
    "EX",
    DEFAULT_IDEMPOTANCY_KEY_DURATION,
    "NX",
  );
}

export async function getIdempotentData(
  authorId: string,
  idempotencyKey: string,
) {
  const redisKey = `idem:${authorId}:${idempotencyKey}`;
  return getRedis().get(redisKey);
}
