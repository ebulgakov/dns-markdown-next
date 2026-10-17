import { cacheDelete } from "@src/cache";
import { Pricelist } from "@src/db/models/pricelist";
import { citySchema } from "@src/service-routes/helpers/schemas";
import { z } from "zod";

import type { NextFunction, Request, Response } from "express";

async function deleteLastPriceListHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = citySchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { city } = validationResult.data;

    await Pricelist.findOneAndDelete({ city }, { sort: { updatedAt: -1 } }).exec();

    const key = `daily:pricelist:last:${String(city)}`;
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

export default deleteLastPriceListHandler;
