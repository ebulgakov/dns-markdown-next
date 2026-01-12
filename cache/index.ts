import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

const add = async (key: string, value: string) => {
  await redis.set(key, value);
};

const get = async (key: string) => {
  return await redis.get(key);
};

const remove = async (key: string) => {
  await redis.del(key);
};

export { redis, get, add, remove };
