import getPerformance from "@src/helpers/get-performance";

import { deleteOldPriceLists } from "./delete-old-price-lists";

getPerformance(deleteOldPriceLists)
  .then(() => {
    console.log("/************** OLD PRICELISTS DELETED ****************/");
  })
  .catch(err => {
    console.error("Error deleting old price lists:", err);
    process.exit(1);
  });
