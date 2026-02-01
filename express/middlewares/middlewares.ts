import type { RequestHandler } from "express";

export const middleware: RequestHandler = (_req, res) => {
  res.send("Hello World!");
  console.log("Response sent");
};
