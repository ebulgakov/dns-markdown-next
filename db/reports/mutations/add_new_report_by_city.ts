import { Reports } from "#db/models/reports_model.js";

type NewReportByCityType = {
  city: string;
  report: string;
  dateAdded?: string;
};

export const addNewReportByCity = async ({ city, report, dateAdded }: NewReportByCityType) => {
  if (!city) throw new Error("City is required");
  if (!report) throw new Error("Report data is required");

  const newReport = new Reports({ city, dateAdded, report });

  return newReport.save();
};
