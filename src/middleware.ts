import bodyParser from "body-parser";
import express, { Express } from "express";
export default function setGlobalMiddleware(app: Express) {
  app.use(express.static("public"));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
}
