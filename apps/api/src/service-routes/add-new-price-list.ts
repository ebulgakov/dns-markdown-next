import { cacheDelete } from "@src/cache";
import { Pricelist } from "@src/db/models/pricelist";
import { addNewPriceListBodySchema } from "@src/service-routes/helpers/schemas";
import { z } from "zod";

import type { NextFunction, Response, Request } from "express";

async function addNewPriceListHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = addNewPriceListBodySchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { city, positions } = validationResult.data;

    const priceList = new Pricelist({
      city,
      positions
    });

    await priceList.save();

    const key = `daily:pricelist:last:${String(city)}`;
    try {
      await cacheDelete(key);
    } catch (cacheError) {
      console.warn("Failed to invalidate cache", { key, cacheError });
    }

    res.status(201).json(priceList);
  } catch (error) {
    next(error);
  }
}

export default addNewPriceListHandler;
