import express from "express";
import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import getPath from "../helpers/get_path.js";

export const updateRequest = express.Router();

updateRequest.route("/").post((req, res) => {
  if (!req.body || !req.body.request) {
    res.status(400).send("Bad Request: No data provided");
    return;
  }

  writeFileSync(join(getPath("../../", import.meta.url), "request.sh"), req.body.request);
  res.redirect("/update-request");
});


updateRequest.route("/").get((req, res) => {
  const request = readFileSync(join(getPath("../../", import.meta.url), "request.sh"));
  res.render("update-request.html", { request });
});

export default updateRequest;
