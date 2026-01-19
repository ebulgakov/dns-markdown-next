import { Redis } from "@upstash/redis";

import type { SetCommandOptions } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const withPrefix = (key: string) => {
  const prefix = process.env.CACHE_PREFIX || "";
  return `${prefix}${key}`;
};

async function add(key: string, value: string, options: SetCommandOptions = {}) {
  await redis.set(withPrefix(key), value, options);
}

async function get<T>(key: string): Promise<T | null> {
  return await redis.get(withPrefix(key));
}

async function remove(key: string) {
  await redis.del(withPrefix(key));
}

async function keys(pattern: string) {
  return await redis.keys(withPrefix(pattern));
}

export { get, add, remove, keys };
