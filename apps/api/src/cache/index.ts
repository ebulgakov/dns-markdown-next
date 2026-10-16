import { env } from "@src/env";
import { Redis } from "@upstash/redis";

import type { SetCommandOptions } from "@upstash/redis";

const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN
});

const withPrefix = (key: string) => {
  return `${env.CACHE_PREFIX}${key}`;
};

async function cacheAdd<T>(key: string, value: T, options: SetCommandOptions = {}) {
  await redis.set(withPrefix(key), value, options);
}

async function cacheGet<T>(key: string): Promise<T | null> {
  return await redis.get(withPrefix(key));
}

async function cacheKeys(pattern: string) {
  const keys = await redis.keys(withPrefix(pattern));
  return keys.map(key =>
    key.startsWith(env.CACHE_PREFIX) ? key.slice(env.CACHE_PREFIX.length) : key
  );
}

async function cacheDelete(key: string) {
  await redis.del(withPrefix(key));
}

export { cacheGet, cacheAdd, cacheKeys, cacheDelete };
