import { AnalysisData } from "@src/db/models/analysis-data";
import { insertAnalysisDataBodySchema } from "@src/service-routes/helpers/schemas";
import { z } from "zod";

import type { NextFunction, Response, Request } from "express";

async function insertAnalysisDataHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = insertAnalysisDataBodySchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { analysisData } = validationResult.data;

    await AnalysisData.insertMany(analysisData);
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
}

export default insertAnalysisDataHandler;
