import { add as cacheAdd, get as cacheGet } from "@/cache";
import { AnalysisData } from "@/db/models/analysis-data-model";

import type { AnalysisData as AnalysisDataType } from "@/types/analysis-data";

type GetAnalysisGoodsByParam = {
  param: keyof typeof AnalysisData.schema.obj;
  value: string | number | boolean;
  city: string;
};

export const getAnalysisGoodsByParam = async ({ param, value, city }: GetAnalysisGoodsByParam) => {
  const cacheKey = `analysis-goods-by-${String(param)}-${value}`;
  const cachedData = cacheGet<AnalysisDataType[]>(cacheKey);
  if (cachedData) return cachedData;

  const analysisGoods = await AnalysisData.find({ [param]: value, city })
    .lean()
    .exec();
  if (!analysisGoods) throw new Error("No analysis goods found");

  const plainAnalysisGoods = JSON.stringify(analysisGoods);
  await cacheAdd(cacheKey, plainAnalysisGoods);

  return JSON.parse(plainAnalysisGoods);
};
