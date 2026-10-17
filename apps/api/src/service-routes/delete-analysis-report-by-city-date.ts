import { cacheDelete } from "@src/cache";
import { Reports } from "@src/db/models/reports";
import { cityDateSchema } from "@src/service-routes/helpers/schemas";
import { z } from "zod";

import type { NextFunction, Response, Request } from "express";

async function deleteAnalysisReportByCityDateHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const validationResult = cityDateSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { city, dateAdded } = validationResult.data;
    const parsedDate = new Date(dateAdded);

    await Reports.deleteMany({ city, dateAdded: parsedDate }).exec();

    const key = `daily:analysis:reports:${String(city)}`;

    // TODO: add invalidation of related cache entries
    try {
      await cacheDelete(key);
    } catch (cacheError) {
      console.warn("Failed to invalidate cache", { key, cacheError });
    }

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

export default deleteAnalysisReportByCityDateHandler;
