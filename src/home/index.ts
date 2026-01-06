import { RequestHandler } from "express";
import getPath from "#helpers/get_path.js";
import { join } from "node:path";
import { readFileSync } from "node:fs";

export const home: RequestHandler = (req, res) => {
  let request;
  try {
    const path = getPath("../../", import.meta.url);
    request = readFileSync(join(path, "request.sh"));
  } catch (error) {
    request = "";
  }
  res.render("index.html", { request });
};
