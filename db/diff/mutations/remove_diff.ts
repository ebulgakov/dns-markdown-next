import { Diff } from "../../models/diff_model.ts";

export const removeDiff = (city: string) => {
  return Diff.deleteOne({ city });
};
