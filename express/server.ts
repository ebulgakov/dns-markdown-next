import express from "express";
import ejs from "ejs";
import { home } from "./home/index.js";
import updateRouter from "./update-request/index.js";
import setGlobalMiddleware from "./middleware.js";
import getPath from "#helpers/get_path.js";
import logRouter from "./log/index.js";
import configRouter from "./config/index.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", getPath("templates", import.meta.url));
app.engine("html", ejs.renderFile);

// Apply middleware
setGlobalMiddleware(app);

// Define routes
app.get("/", home);
app.use("/update-request", updateRouter);
app.use("/log", logRouter);
app.use("/config", configRouter);

export default app;
