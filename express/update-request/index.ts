import express from "express";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

export const updateRouter = express.Router();

updateRouter.route("/").post((req, res) => {
  if (!req.body || !req.body.request) {
    res.status(400).send("Bad Request: No data provided");
    return;
  }

  const unixStringRequest = req.body.request.replace(/\r?\n/g, "\n");
  writeFileSync(resolve("request.sh"), unixStringRequest);
  res.redirect(307, "/log");
});

export default updateRouter;
