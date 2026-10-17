import type { Env } from "../src/shared/config/env";

// Server actions reachable from client components get bundled into Storybook,
// where there is no server env: replace the validated env with placeholders.
export const env: Env = {
  API_URL: "http://localhost:4000",
  API_SECRET_KEY: "storybook-api-secret",
  WEBHOOK_SECRET_KEY: "storybook-webhook-secret",
  UPSTASH_REDIS_REST_URL: "https://redis.storybook",
  UPSTASH_REDIS_REST_TOKEN: "storybook-redis-token",
  DEFAULT_CITY: "samara",
  GA_ID: undefined
};
