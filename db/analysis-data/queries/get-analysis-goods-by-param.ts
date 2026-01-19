import { add as cacheAdd, get as cacheGet } from "@/cache";
import { dbConnect } from "@/db/database";
import { AnalysisData } from "@/db/models/analysis-data-model";

import type { AnalysisData as AnalysisDataType } from "@/types/analysis-data";

type GetAnalysisGoodsByParam = {
  param: keyof typeof AnalysisData.schema.obj;
  value: Date | string | number | boolean;
  date: string;
  city: string;
};

export const getAnalysisGoodsByParam = async ({
  param,
  value,
  city,
  date
}: GetAnalysisGoodsByParam) => {
  const cacheKey = `analysis-goods-by-${String(param)}-${value}-${city}-${date}`;
  const cachedData = await cacheGet<AnalysisDataType[]>(cacheKey);
  if (cachedData) return cachedData;

  await dbConnect();

  const analysisGoods = await AnalysisData.find({ [param]: value, city })
    .lean()
    .exec();
  if (!analysisGoods) throw new Error("No analysis goods found");

  (analysisGoods as unknown as AnalysisDataType[]).sort(
    (a, b) => new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime()
  );

  const plainAnalysisGoods = JSON.stringify(analysisGoods);
  await cacheAdd(cacheKey, plainAnalysisGoods, { ex: 60 * 60 * 24 }); // 24 hours

  return JSON.parse(plainAnalysisGoods) as AnalysisDataType[];
};
