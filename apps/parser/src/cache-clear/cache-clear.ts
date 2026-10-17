import { api } from "@src/api/client";
import { clearWebCache } from "@src/api/web";
import { env } from "@src/env";

export async function clearCache() {
  const keys = env.KEYS;

  await api.service.clearCacheByKeys(keys);
  await clearWebCache("daily-data");
}
