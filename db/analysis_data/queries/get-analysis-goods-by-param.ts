import { AnalysisData } from "#db/models/analysis_data_model.js";
import type { AnalysisData as AnalysisDataType } from "#types/analysis_data.js";

type GetAnalysisGoodsByParam = {
  param: keyof typeof AnalysisData.schema.obj;
  value: string | number | boolean;
  city: string;
};

export const getAnalysisGoodsByParam = async ({
  param,
  value,
  city
}: GetAnalysisGoodsByParam): Promise<AnalysisDataType[]> => {
  return AnalysisData.find({ [param]: value, city })
    .lean()
    .exec();
};
