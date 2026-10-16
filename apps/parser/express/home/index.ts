import type { RequestHandler } from "express";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

export const home: RequestHandler = (_req, res) => {
  let request;
  try {
    request = readFileSync(resolve("request.sh"));
  } catch (error) {
    request = "";
  }
  res.render("index.html", { request });
};
