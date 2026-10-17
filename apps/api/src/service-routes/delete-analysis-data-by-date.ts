import { AnalysisData } from "@src/db/models/analysis-data";
import { cityDateSchema } from "@src/service-routes/helpers/schemas";
import { z } from "zod";

import type { NextFunction, Response, Request } from "express";

async function deleteAnalysisDataByDateHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = cityDateSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { city, dateAdded } = validationResult.data;
    const parsedDate = new Date(dateAdded);

    await AnalysisData.deleteMany({ city, dateAdded: parsedDate }).exec();

    // TODO: add invalidation of related cache entries
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

export default deleteAnalysisDataByDateHandler;
