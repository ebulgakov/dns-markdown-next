import { AnalysisDiff } from "@src/db/models/analysis-diff";
import { insertAnalysisDiffBodySchema } from "@src/service-routes/helpers/schemas";
import { z } from "zod";

import type { NextFunction, Response, Request } from "express";

async function insertAnalysisDiffHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = insertAnalysisDiffBodySchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { diff } = validationResult.data;

    await AnalysisDiff.insertMany(diff);
    res.sendStatus(201);
  } catch (error) {
    next(error);
  }
}

export default insertAnalysisDiffHandler;
