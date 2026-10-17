import { AnalysisData } from "@src/db/models/analysis-data";
import { citySchema } from "@src/service-routes/helpers/schemas";
import { z } from "zod";

import type { NextFunction, Response, Request } from "express";

async function deleteAnalysisDataHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = citySchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { city } = validationResult.data;

    await AnalysisData.deleteMany({ city }).exec();

    // TODO: add invalidation of related cache entries
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}
export default deleteAnalysisDataHandler;
