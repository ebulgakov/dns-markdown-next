import { api } from "@src/api/client";
import { env } from "@src/env";

export async function addReport() {
  const city = env.CITY;
  if (!city) throw new Error("No city found");
  await api.service.addNewReportByCity({ city });
}
