import { Pricelist } from "@dns-markdown/db/models/pricelist";
import { cacheAdd, cacheGet } from "@src/cache";
import { priceListByIdParamsSchema } from "@src/pricelist-routes/helpers/schemas";
import { z } from "zod";

import type { PriceList as PriceListType } from "@dns-markdown/db/types/pricelist";
import type { NextFunction, Request, Response } from "express";

async function priceListByIdHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = priceListByIdParamsSchema.safeParse(req.params);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { id } = validationResult.data;

    const key = `archive:item:${String(id)}`;
    const cached = await cacheGet<PriceListType>(key);
    if (cached) return res.json(cached);

    const priceList = (await Pricelist.findOne({ _id: id }).lean().exec()) as PriceListType;
    if (!priceList) return res.status(404).send("Archived price list not found");

    await cacheAdd<PriceListType>(key, priceList); // no expiration

    res.json(priceList);
  } catch (error) {
    next(error);
  }
}

export default priceListByIdHandler;
