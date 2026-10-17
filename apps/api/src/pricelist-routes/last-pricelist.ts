import { cacheAdd, cacheGet } from "@src/cache";
import { getLastPriceListWithDates } from "@src/pricelist-routes/helpers/get-last-price-list.ts";
import { lastPriceListQuerySchema } from "@src/pricelist-routes/helpers/schemas";
import { z } from "zod";

import type { PriceList as PriceListType } from "@dns-markdown/types/pricelist";
import type { NextFunction, Request, Response } from "express";

async function lastPriceListHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = lastPriceListQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { city } = validationResult.data;

    const key = `daily:pricelist:last:${String(city)}`;
    const cached = await cacheGet<PriceListType>(key);
    if (cached) return res.json(cached);

    const priceList = await getLastPriceListWithDates(city);
    if (!priceList) return res.status(404).send("Price list not found");

    await cacheAdd<PriceListType>(key, priceList, { ex: 60 * 60 * 24 }); // 24 hours

    res.json(priceList);
  } catch (error) {
    next(error);
  }
}

export default lastPriceListHandler;
