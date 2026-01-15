import getPerformance from "#helpers/get_performance.js";

async function addAnalysisDiff() {
  const writeStrategy = process.env.WRITE_STRATEGY || "insert";
  const city = process.env.CITY || "samara";


}

getPerformance(addAnalysisDiff).then(() => {
  console.log("/************** ANALYSIS DIFF ADDED ****************/");
});
