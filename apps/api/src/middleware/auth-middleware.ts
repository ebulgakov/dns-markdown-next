import { env } from "@src/env";

import type { NextFunction, Request, Response } from "express";

export const authServiceMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1] || "";

  // Just in case if token is empty string and API_SERVICE_KEY also empty string
  if (!token || token !== env.API_SERVICE_KEY) {
    return res.status(401).json({ error: "Unauthorized Service" });
  }

  next();
};

export const authPublicMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const secret = req.header("X-Internal-API-Secret");

  if (!secret || secret !== env.API_SECRET_KEY) {
    return res.status(403).json({ error: "Forbidden: Invalid API secret" });
  }

  next();
};
