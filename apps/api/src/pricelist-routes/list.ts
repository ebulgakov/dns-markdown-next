import { Pricelist } from "@dns-markdown/db/models/pricelist";
import { cacheAdd, cacheGet } from "@src/cache";
import { listPriceListsQuerySchema } from "@src/pricelist-routes/helpers/schemas";
import { z } from "zod";

import type { PriceListDate } from "@dns-markdown/db/types/pricelist";
import type { NextFunction, Request, Response } from "express";

async function listPriceListsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = listPriceListsQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { city } = validationResult.data;

    const key = `daily:archive:list:${String(city)}`;
    const cached = await cacheGet<PriceListDate[]>(key);
    if (cached) return res.json(cached);

    const priceLists = (await Pricelist.find({ city }, {}, { sort: { updatedAt: 1 } })
      .select("createdAt")
      .lean()
      .exec()) as PriceListDate[];

    await cacheAdd<PriceListDate[]>(key, priceLists, { ex: 60 * 60 * 24 }); // 24 hours

    res.json(priceLists);
  } catch (error) {
    next(error);
  }
}

export default listPriceListsHandler;
