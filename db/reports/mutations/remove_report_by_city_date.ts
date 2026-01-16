import { Reports } from "#db/models/reports_model.js";

type RemoveReportByCityDateType = {
  city: string;
  dateAdded?: string;
};

export const removeReportByCityDate = async ({ city, dateAdded }: RemoveReportByCityDateType) => {
  if (!dateAdded) throw new Error("Date is required");
  if (!city) throw new Error("City is required");
  return Reports.deleteMany({ dateAdded, city });
};
