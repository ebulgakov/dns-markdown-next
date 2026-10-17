import { cacheAdd, cacheGet } from "@src/cache";
import { getLastPriceListFlat } from "@src/pricelist-routes/helpers/get-last-price-list";
import { cityQuerySchema } from "@src/products-routes/helpers/schemas";
import { z } from "zod";

import type { Goods } from "@dns-markdown/types/pricelist";
import type { NextFunction, Request, Response } from "express";

async function mostProfitableProductsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = cityQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { city } = validationResult.data;

    const key = `daily:products:most-profitable-products:${String(city)}`;
    const cached = await cacheGet<Goods[]>(key);
    if (cached) return res.json(cached);

    const flatCatalog = await getLastPriceListFlat(city);
    const profitableItems = flatCatalog.filter(
      item => Number(item.profit) && Number(item.profit) > 0
    );
    const nonProfitableItems = flatCatalog.filter(
      item => !Number(item.profit) || Number(item.profit) <= 0
    );
    profitableItems.sort((a, b) => Number(b.profit) - Number(a.profit));

    const sortedByProfit = [...profitableItems, ...nonProfitableItems];

    await cacheAdd<Goods[]>(key, sortedByProfit, { ex: 60 * 60 * 24 }); // 24 hours

    res.json(sortedByProfit);
  } catch (error) {
    next(error);
  }
}

export default mostProfitableProductsHandler;
