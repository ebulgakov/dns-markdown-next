import getPerformance from "@src/helpers/get-performance";

import { checkFavorites } from "./check-favorites";

getPerformance(checkFavorites)
  .then(() => {
    console.log("/************** FAVORITES CHECKED ****************/");
  })
  .catch(err => {
    console.error("Error checking favorites:", err);
    process.exit(1);
  });
