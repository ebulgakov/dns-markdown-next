import { dbConnect } from "@dns-markdown/db/database";
import { env } from "@src/env";

import type { NextFunction, Request, Response } from "express";

export const ensureDbConnectionMiddleware = async (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    await dbConnect(env.DATABASE_URL);
    next();
  } catch (error) {
    next(error);
  }
};
