import { resolve } from "node:path";

import ejs from "ejs";
import express from "express";

import configRouter from "./config";
import { home } from "./home";
import logRouter from "./log";
import setGlobalMiddleware from "./middleware";
import updateRouter from "./update-request";

const app = express();

app.set("view engine", "ejs");
app.set("views", resolve("src", "express", "templates"));
app.engine("html", ejs.renderFile);

// Apply middleware
setGlobalMiddleware(app);

// Define routes
app.get("/", home);
app.use("/update-request", updateRouter);
app.use("/log", logRouter);
app.use("/config", configRouter);

export default app;
