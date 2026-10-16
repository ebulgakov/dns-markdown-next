import { cacheAdd, cacheGet } from "@src/cache";
import { getLastPriceListFlat } from "@src/pricelist-routes/helpers/get-last-price-list";
import { cityQuerySchema } from "@src/products-routes/helpers/schemas";
import { z } from "zod";

import type { Goods } from "@dns-markdown/db/types/pricelist";
import type { NextFunction, Request, Response } from "express";
async function mostCheapProductsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = cityQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { city } = validationResult.data;

    const key = `daily:products:most-cheap-products:${String(city)}`;
    const cached = await cacheGet<Goods[]>(key);
    if (cached) return res.json(cached);

    const flatCatalog = await getLastPriceListFlat(city);
    const sortedByPrice = flatCatalog
      .filter(item => Number(item.price) && Number(item.price) > 0)
      .sort((a, b) => Number(a.price) - Number(b.price));

    await cacheAdd<Goods[]>(key, sortedByPrice, { ex: 60 * 60 * 24 }); // 24 hours

    res.json(sortedByPrice);
  } catch (error) {
    next(error);
  }
}

export default mostCheapProductsHandler;
