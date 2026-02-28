import getPerformance from "#helpers/get_performance.ts";
import { addNewReportByCity } from "#api/post.ts";

async function addReport() {
  const city = process.env.CITY;
  if (!city) throw new Error("No city found");
  await addNewReportByCity({ city });
}

getPerformance(addReport)
  .then(() => {
    console.log("/************** REPORT ADDED ****************/");
  })
  .catch(err => {
    console.error("Error adding report:", err);
  });
