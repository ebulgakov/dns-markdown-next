import getPerformance from "@src/helpers/get-performance";

import { addAnalysisDiff } from "./add-analysis-diff";

getPerformance(addAnalysisDiff)
  .then(() => {
    console.log("/************** ANALYSIS DIFF ADDED ****************/");
  })
  .catch(err => {
    console.error("Error adding analysis diff:", err);
    process.exit(1);
  });
