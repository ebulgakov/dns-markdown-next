import getPerformance from "@src/helpers/get-performance";

import { clearCache } from "./cache-clear";

getPerformance(clearCache).then(() => {
  console.log("/************** CLEARED CACHE ****************/");
});
