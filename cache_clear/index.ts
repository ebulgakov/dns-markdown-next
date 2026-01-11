import redis from "#cache/index.js";
import getPerformance from "#helpers/get_performance.js";

async function clearCache() {
  const keys = await redis.keys(`pricelist:*`);
  console.log(`Clearing ${keys.length} cache keys related to pricelist...`);
  for (const key of keys) {
    await redis.del(key);
    console.log(`Deleted cache key: ${key}`);
  }
}

getPerformance(clearCache).then(() => {
  console.log("/************** CLEARED CACHE ****************/");
});
