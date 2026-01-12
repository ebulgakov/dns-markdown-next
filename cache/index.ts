import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

async function add(key: string, value: string) {
  await redis.set(key, value);
}

async function get<T>(key: string): Promise<T | null> {
  return await redis.get(key);
}

async function remove(key: string) {
  await redis.del(key);
}

export { get, add, remove };
