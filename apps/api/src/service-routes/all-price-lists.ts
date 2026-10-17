import { Pricelist } from "@src/db/models/pricelist";
import { allPriceListsQuerySchema } from "@src/service-routes/helpers/schemas";
import { z } from "zod";

import type { NextFunction, Request, Response } from "express";

async function allPriceListsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = allPriceListsQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { city, limit } = validationResult.data;

    const priceLists = await Pricelist.find(
      { city },
      {},
      { sort: { updatedAt: -1 }, ...(limit === undefined ? {} : { limit }) }
    ).exec();
    res.json(priceLists);
  } catch (error) {
    next(error);
  }
}

export default allPriceListsHandler;
