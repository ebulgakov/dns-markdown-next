import { cacheAdd, cacheGet } from "@src/cache";
import { AnalysisData } from "@src/db/models/analysis-data";
import { getLastPriceListFlat } from "@src/pricelist-routes/helpers/get-last-price-list";
import { linkQuerySchema } from "@src/products-routes/helpers/schemas";
import { z } from "zod";

import type { AnalysisData as AnalysisDataType } from "@dns-markdown/types/analysis-data";
import type { DiffHistory } from "@dns-markdown/types/analysis-diff";
import type { ProductPayload } from "@dns-markdown/types/product";
import type { FavoriteStatus } from "@dns-markdown/types/user";
import type { NextFunction, Request, Response } from "express";

async function productByLinkHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = linkQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { link } = validationResult.data;

    const key = `daily:products:link:${link}`;
    const cached = await cacheGet<ProductPayload>(key);
    if (cached) return res.json(cached);

    const historyList = (await AnalysisData.find({ link })
      .sort({ dateAdded: 1 })
      .lean()
      .exec()) as AnalysisDataType[];

    const firstEntry = historyList[0];
    const lastEntry = historyList[historyList.length - 1];
    if (!firstEntry || !lastEntry) return res.status(404).send("Product not found");

    const history: DiffHistory = historyList.map(entry => {
      return {
        dateAdded: entry.dateAdded,
        price: entry.price,
        priceOld: entry.priceOld,
        profit: entry.profit
      };
    });

    const flatCatalog = await getLastPriceListFlat(lastEntry.city);
    const existsInCatalog = flatCatalog.some(item => item.link === link);
    const dateAdded = firstEntry.dateAdded;

    const status: FavoriteStatus = {
      createdAt: dateAdded,
      updatedAt: lastEntry.dateAdded,
      deleted: !existsInCatalog,
      city: lastEntry.city
    };

    const payload: ProductPayload = {
      item: { ...lastEntry, dateAdded },
      history,
      status
    };

    await cacheAdd<ProductPayload>(key, payload, { ex: 60 * 60 * 24 }); // 24 hours

    res.json(payload);
  } catch (error) {
    next(error);
  }
}

export default productByLinkHandler;
