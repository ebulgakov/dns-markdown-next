import { Diff } from "../../models/diff_model.ts";

export const addDiff = async (city: string, changesPrice: any[], changesProfit: any[]) => {
  const diff = new Diff({
    city,
    changesPrice,
    changesProfit
  });
  await diff.save();
  return diff;
};
