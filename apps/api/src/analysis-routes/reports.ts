import { Reports } from "@dns-markdown/db/models/reports";
import { cityQuerySchema } from "@src/analysis-routes/helpers/schemas";
import { cacheAdd, cacheGet } from "@src/cache";
import { z } from "zod";

import type { ReportsResponse } from "@dns-markdown/types/reports";
import type { NextFunction, Response, Request } from "express";

async function reportsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = cityQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { city } = validationResult.data;

    const key = `daily:analysis:reports:${String(city)}`;
    const cached = await cacheGet<ReportsResponse>(key);
    if (cached) return res.json(cached);

    const reports = (await Reports.find({ city }, {}, { sort: { dateAdded: -1 }, limit: 30 })
      .lean()
      .exec()) as ReportsResponse;

    await cacheAdd<ReportsResponse>(key, reports, { ex: 60 * 60 * 24 }); // 24 hours

    res.json(reports);
  } catch (error) {
    next(error);
  }
}

export default reportsHandler;
