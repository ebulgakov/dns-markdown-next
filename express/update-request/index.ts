import express from "express";
import { join } from "path";
import { writeFileSync } from "node:fs";
import getPath from "#helpers/get_path.js";

export const updateRouter = express.Router();

const path = getPath("../../", import.meta.url);

updateRouter.route("/").post((req, res) => {
  if (!req.body || !req.body.request) {
    res.status(400).send("Bad Request: No data provided");
    return;
  }

  const unixStringRequest = req.body.request.replace(/\r?\n/g, "\n");
  writeFileSync(join(path, "request.sh"), unixStringRequest);
  res.redirect(307, "/log");
});

export default updateRouter;
