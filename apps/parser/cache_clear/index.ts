import { clearCacheByKeys, clearWebCache } from "#api/post.ts";
import { env } from "#env.ts";
import getPerformance from "#helpers/get_performance.ts";

async function clearCache() {
  const keys = env.KEYS;

  await clearCacheByKeys(keys);
  await clearWebCache("daily-data");
}

getPerformance(clearCache).then(() => {
  console.log("/************** CLEARED CACHE ****************/");
});
