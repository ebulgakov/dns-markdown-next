import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import type { RequestHandler } from "express";

export const home: RequestHandler = (_req, res) => {
  let request;
  try {
    request = readFileSync(resolve("request.sh"));
  } catch {
    request = "";
  }
  res.render("index.html", { request });
};
