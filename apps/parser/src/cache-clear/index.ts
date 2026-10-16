import { clearCacheByKeys, clearWebCache } from "@src/api/post";
import { env } from "@src/env";
import getPerformance from "@src/helpers/get-performance";

async function clearCache() {
  const keys = env.KEYS;

  await clearCacheByKeys(keys);
  await clearWebCache("daily-data");
}

getPerformance(clearCache).then(() => {
  console.log("/************** CLEARED CACHE ****************/");
});
