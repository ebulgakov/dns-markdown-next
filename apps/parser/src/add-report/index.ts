import { addNewReportByCity } from "@src/api/post";
import { env } from "@src/env";
import getPerformance from "@src/helpers/get-performance";

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
