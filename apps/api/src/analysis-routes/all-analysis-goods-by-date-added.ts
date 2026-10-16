import { AnalysisData } from "@dns-markdown/db/models/analysis-data";
import { cityDateQuerySchema } from "@src/analysis-routes/helpers/schemas";
import { cacheAdd, cacheGet } from "@src/cache";
import { z } from "zod";

import type { AnalysisData as AnalysisDataType } from "@dns-markdown/db/types/analysis-data";
import type { NextFunction, Request, Response } from "express";

async function allAnalysisGoodsByDateAddedHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = cityDateQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { city, dateAdded } = validationResult.data;
    const parsedDate = new Date(dateAdded);

    const key = `analysis:goods-by-date:${parsedDate.toISOString()}-${String(city)}`;
    const cached = await cacheGet<AnalysisDataType[]>(key);
    if (cached) return res.send(cached);

    const goods = (await AnalysisData.find(
      { city, dateAdded: parsedDate },
      {},
      { sort: { updatedAt: 1 } }
    )
      .lean()
      .exec()) as AnalysisDataType[];

    await cacheAdd<AnalysisDataType[]>(key, goods); // Save forever

    res.json(goods);
  } catch (error) {
    next(error);
  }
}

export default allAnalysisGoodsByDateAddedHandler;
