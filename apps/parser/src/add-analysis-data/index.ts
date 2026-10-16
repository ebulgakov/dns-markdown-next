import getPerformance from "@src/helpers/get-performance";

import { addAnalysisData } from "./add-analysis-data";

getPerformance(addAnalysisData)
  .then(() => {
    console.log("/************** ANALYSIS DATA ADDED ****************/");
  })
  .catch(err => {
    console.error("Error adding analysis data:", err);
    process.exit(1);
  });
