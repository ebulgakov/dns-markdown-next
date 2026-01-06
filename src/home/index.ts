import { RequestHandler } from "express";

export const home: RequestHandler = (req, res) => {
  res.render("index.html");
};
