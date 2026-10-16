import { cacheDelete, cacheKeys } from "@src/cache";
import { clearCacheByKeyBodySchema } from "@src/service-routes/helpers/schemas";
import { z } from "zod";

import type { NextFunction, Request, Response } from "express";

async function clearCacheByKeyHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const validationResult = clearCacheByKeyBodySchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ errors: z.prettifyError(validationResult.error) });
    }
    const { keys } = validationResult.data;

    const foundKeys = await cacheKeys(keys);
    await Promise.all(
      foundKeys
        .map(key => (key && key !== "" ? key : null))
        .filter(Boolean)
        .map(key => cacheDelete(key as string))
    );
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

export default clearCacheByKeyHandler;
