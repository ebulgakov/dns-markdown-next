import getPerformance from "@src/helpers/get-performance";

import { addPriceList } from "./add-price-list";

getPerformance(addPriceList)
  .then(() => {
    console.log("/************** PRICE LIST ADDED ****************/");
  })
  .catch(err => {
    console.error("Error adding price list:", err);
    process.exit(1);
  });
