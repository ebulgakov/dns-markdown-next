import express from "express";
import { writeFileSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

export const configRouter = express.Router();

const path = resolve("parser");

configRouter.route("/").post((req, res) => {
  if (!req.body || !req.body.parser_goods || !req.body.parser_prices || !req.body.crawler) {
    res.status(400).send("Bad Request: No config provided");
    return;
  }

  const unixStringGoods = req.body.parser_goods.replace(/\r?\n/g, "\n");
  writeFileSync(join(path, "dns_shop_downloader.sh"), unixStringGoods);

  const unixStringPrices = req.body.parser_prices.replace(/\r?\n/g, "\n");
  writeFileSync(join(path, "dns_shop_downloader_prices.sh"), unixStringPrices);

  res.redirect("/config");
});

configRouter.route("/").get((req, res) => {
  let dns_shop_downloader, dns_shop_downloader_prices;
  try {
    dns_shop_downloader = readFileSync(join(path, "dns_shop_downloader.sh"));
    dns_shop_downloader_prices = readFileSync(join(path, "dns_shop_downloader_prices.sh"));
  } catch (e) {
    dns_shop_downloader = "";
    dns_shop_downloader_prices = "";
  }

  res.render("config.html", { dns_shop_downloader, dns_shop_downloader_prices });
});

export default configRouter;
