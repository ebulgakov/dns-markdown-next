import { RequestHandler } from "express";

export const updateRequest: RequestHandler = (req, res) => {
  console.log(req.body);
  res.send(`Update Request Handler ${JSON.stringify(req.body)}`);
};
