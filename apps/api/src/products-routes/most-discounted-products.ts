import { cacheAdd, cacheGet } from "@src/cache";
import { getLastPriceListFlat } from "@src/pricelist-routes/helpers/get-last-price-list";
import { cityQuerySchema } from "@src/products-routes/helpers/schemas";
import { z } from "zod";

import type { Goods } from "@dns-markdown/types/pricelist";
import type { NextFunction, Request, Response } from "express";

async function mostDiscountedProductsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = cityQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { city } = validationResult.data;

    const key = `daily:products:most-discounted-products:${String(city)}`;
    const cached = await cacheGet<Goods[]>(key);
    if (cached) return res.json(cached);

    const flatCatalog = await getLastPriceListFlat(city);
    const withOldPrice = flatCatalog.filter(
      item => Number(item.priceOld) && Number(item.priceOld) > 0
    );
    const withoutOldPrice = flatCatalog.filter(
      item => !Number(item.priceOld) || Number(item.priceOld) <= 0
    );
    withOldPrice.sort(
      (a, b) =>
        (Number(a.price) * 100) / Number(a.priceOld) - (Number(b.price) * 100) / Number(b.priceOld)
    );

    const sortedByDiscount = [...withOldPrice, ...withoutOldPrice];

    await cacheAdd<Goods[]>(key, sortedByDiscount, { ex: 60 * 60 * 24 }); // 24 hours

    res.json(sortedByDiscount);
  } catch (error) {
    next(error);
  }
}

export default mostDiscountedProductsHandler;
