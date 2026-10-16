import { Pricelist } from "@dns-markdown/db/models/pricelist";
import { cacheDelete } from "@src/cache";
import { citySchema } from "@src/service-routes/helpers/schemas";
import { z } from "zod";

import type { NextFunction, Request, Response } from "express";

const KEEP_PRICE_LISTS_COUNT = 30;

async function deleteOldPriceListsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = citySchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { city } = validationResult.data;

    const oldPriceLists = (await Pricelist.find(
      { city },
      { _id: 1 },
      { sort: { updatedAt: -1, _id: -1 }, skip: KEEP_PRICE_LISTS_COUNT }
    )
      .lean()
      .exec()) as { _id: unknown }[];

    if (oldPriceLists.length === 0) return res.json({ deletedCount: 0 });

    const ids = oldPriceLists.map(priceList => priceList._id);
    const { deletedCount } = await Pricelist.deleteMany({ _id: { $in: ids } }).exec();

    const keys = [
      `daily:archive:list:${String(city)}`,
      ...ids.map(id => `archive:item:${String(id)}`)
    ];
    try {
      await Promise.all(keys.map(key => cacheDelete(key)));
    } catch (cacheError) {
      console.warn("Failed to invalidate cache", { keys, cacheError });
    }

    res.json({ deletedCount });
  } catch (error) {
    next(error);
  }
}

export default deleteOldPriceListsHandler;
