import getPerformance from "#helpers/get_performance.ts";
import { clearCacheByKeys, clearWebCache } from "#api/post.ts";

async function clearCache() {
  const keys = process.env.KEYS || "daily:*";

  await clearCacheByKeys(keys);
  await clearWebCache("daily-data");
}

getPerformance(clearCache).then(() => {
  console.log("/************** CLEARED CACHE ****************/");
});
