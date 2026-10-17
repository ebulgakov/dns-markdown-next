import { cityQuerySchema } from "@src/analysis-routes/helpers/schemas";
import { cacheAdd, cacheGet } from "@src/cache";
import { AnalysisData } from "@src/db/models/analysis-data";
import { z } from "zod";

import type { NextFunction, Request, Response } from "express";

async function totalUniqProductsCountHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = cityQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { city } = validationResult.data;

    const key = `daily:analysis:uniq-count:${String(city)}`;
    const cached = await cacheGet<number>(key);
    if (cached) return res.send(cached);

    const [foundItem] = (await AnalysisData.aggregate([
      { $match: { city } },
      { $group: { _id: "$link" } },
      { $count: "uniqueCount" }
    ])) as { uniqueCount: number }[];

    const uniqueCount = foundItem?.uniqueCount ?? 0;

    await cacheAdd<number>(key, uniqueCount, { ex: 60 * 60 * 24 }); // 24 hours

    res.send(uniqueCount);
  } catch (error) {
    next(error);
  }
}

export default totalUniqProductsCountHandler;
