import { cacheAdd, cacheGet } from "@src/cache";
import { compareLLMGoods } from "@src/llm";
import { convertGoodsToString } from "@src/llm-routes/helpers/convert-to-string";
import { compareProductsQuerySchema } from "@src/llm-routes/helpers/schemas";
import { getVectorItemsByIds } from "@src/vector";
import { z } from "zod";

import type { NextFunction, Request, Response } from "express";

async function compareProductsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = compareProductsQuerySchema.safeParse(req.query);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { links } = validationResult.data;

    const key = `llm:compare:${JSON.stringify(links)}`;
    const cached = await cacheGet<string>(key);
    if (cached)
      return res.json({
        message: "Product comparison result (cached)",
        report: cached
      });

    const items = await getVectorItemsByIds(links);
    const itemsString = items.map(({ metadata }) => convertGoodsToString(metadata)).join("\n");

    const comparedGoodsReport = await compareLLMGoods(itemsString);

    await cacheAdd<string>(key, comparedGoodsReport);

    res.json({
      message: "Product comparison result",
      report: comparedGoodsReport
    });
  } catch (err) {
    next(err);
  }
}

export default compareProductsHandler;
