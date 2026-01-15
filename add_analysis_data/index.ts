import { dbConnect, dbDisconnect } from "#db/database.js";
import getPerformance from "#helpers/get_performance.js";

async function addAnalysisData() {
  const writeStrategy = process.env.WRITE_STRATEGY || "insert";
  const city = process.env.CITY || "samara";

  await dbConnect();

  console.log(writeStrategy)

  await dbDisconnect();
}

getPerformance(addAnalysisData).then(() => {
  console.log("/************** DIFF ADDED ****************/");
});
