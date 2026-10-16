import { AnalysisDiff } from "@dns-markdown/db/models/analysis-diff";
import { cityQuerySchema } from "@src/analysis-routes/helpers/schemas";
import { cacheAdd, cacheGet } from "@src/cache";
import { z } from "zod";

import type { AnalysisDiff as AnalysisDiffType } from "@dns-markdown/db/types/analysis-diff";
import type { NextFunction, Response, Request } from "express";

async function lastAnalysisDiffHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = cityQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { city } = validationResult.data;

    const key = `daily:analysis:last:${String(city)}`;
    const cached = await cacheGet<AnalysisDiffType>(key);
    if (cached) return res.json(cached);

    const diff = (await AnalysisDiff.findOne({ city }, {}, { sort: { dateAdded: -1 } })
      .lean()
      .exec()) as AnalysisDiffType | null;
    if (!diff) return res.status(404).send("Analysis diff not found");

    await cacheAdd<AnalysisDiffType>(key, diff, { ex: 60 * 60 * 24 }); // 24 hours

    res.json(diff);
  } catch (error) {
    next(error);
  }
}

export default lastAnalysisDiffHandler;
