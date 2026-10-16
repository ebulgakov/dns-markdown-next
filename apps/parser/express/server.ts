import { resolve } from "node:path";

import ejs from "ejs";
import express from "express";

import configRouter from "./config/index.ts";
import { home } from "./home/index.ts";
import logRouter from "./log/index.ts";
import setGlobalMiddleware from "./middleware.ts";
import updateRouter from "./update-request/index.ts";

const app = express();

app.set("view engine", "ejs");
app.set("views", resolve("express", "templates"));
app.engine("html", ejs.renderFile);

// Apply middleware
setGlobalMiddleware(app);

// Define routes
app.get("/", home);
app.use("/update-request", updateRouter);
app.use("/log", logRouter);
app.use("/config", configRouter);

export default app;
