import { addNewReportByCity } from "@src/api/post";
import { env } from "@src/env";

export async function addReport() {
  const city = env.CITY;
  if (!city) throw new Error("No city found");
  await addNewReportByCity({ city });
}
