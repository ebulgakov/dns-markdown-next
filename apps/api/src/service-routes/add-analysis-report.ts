import { cacheDelete } from "@src/cache";
import { Reports } from "@src/db/models/reports";
import { generateLLMReport } from "@src/llm";
import { convertGoodsToString } from "@src/llm-routes/helpers/convert-to-string";
import { getLastPriceList } from "@src/pricelist-routes/helpers/get-last-price-list";
import { citySchema } from "@src/service-routes/helpers/schemas";
import { z } from "zod";

import type { NextFunction, Response, Request } from "express";

async function addAnalysisReportHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = citySchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { city } = validationResult.data;

    const priceList = await getLastPriceList(city);
    if (!priceList) return res.status(404).send("Price list not found");

    const payload = priceList.positions
      .flatMap(position => position.items)
      .map(convertGoodsToString)
      .join("");

    const report = await generateLLMReport(payload);
    await Reports.updateOne(
      { city, dateAdded: priceList.createdAt },
      { $set: { report } },
      { upsert: true }
    ).exec();

    const key = `daily:analysis:reports:${String(city)}`;
    try {
      await cacheDelete(key);
    } catch (cacheError) {
      console.warn("Failed to invalidate cache", { key, cacheError });
    }

    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

export default addAnalysisReportHandler;
