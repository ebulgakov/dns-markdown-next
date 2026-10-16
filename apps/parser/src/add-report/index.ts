import getPerformance from "@src/helpers/get-performance";

import { addReport } from "./add-report";

getPerformance(addReport)
  .then(() => {
    console.log("/************** REPORT ADDED ****************/");
  })
  .catch(err => {
    console.error("Error adding report:", err);
    process.exit(1);
  });
