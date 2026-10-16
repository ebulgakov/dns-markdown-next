import { clearCacheByKeys, clearWebCache } from "@src/api/post";
import { env } from "@src/env";

export async function clearCache() {
  const keys = env.KEYS;

  await clearCacheByKeys(keys);
  await clearWebCache("daily-data");
}
