import getPerformance from "#helpers/get_performance.ts";
import { cleaCacheByKeys } from "#api/post.ts";

async function clearCache() {
  const keys = process.env.KEYS || "daily:*";

  await cleaCacheByKeys(keys);
}

getPerformance(clearCache).then(() => {
  console.log("/************** CLEARED CACHE ****************/");
});
