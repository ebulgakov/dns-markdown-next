import express from "express";
import ejs from "ejs";
import { home } from "#src/home/index.js";
import updateRequest from "#src/update-request/index.js";
import setGlobalMiddleware from "#src/middleware.js";
import { join } from "path";
import getPath from "#helpers/get_path.js";

const app = express();

app.set("view engine", "ejs");
app.set("views", join(getPath("../templates", import.meta.url)));
app.engine("html", ejs.renderFile);

// Apply middleware
setGlobalMiddleware(app);

// Define routes
app.get("/", home);
app.use("/update-request", updateRequest);

export default app;
