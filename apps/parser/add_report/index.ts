import { addNewReportByCity } from "#api/post.ts";
import { env } from "#env.ts";
import getPerformance from "#helpers/get_performance.ts";

async function addReport() {
  const city = env.CITY;
  if (!city) throw new Error("No city found");
  await addNewReportByCity({ city });
}

getPerformance(addReport)
  .then(() => {
    console.log("/************** REPORT ADDED ****************/");
  })
  .catch(err => {
    console.error("Error adding report:", err);
    process.exit(1);
  });
