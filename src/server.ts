import express from "express";
import { home } from "#src/home/index.js";
import { updateRequest } from "#src/update-request/index.js";
import setGlobalMiddleware from "#src/middleware.js";

const app = express();

// Apply middleware
setGlobalMiddleware(app);

// Define routes
app.get("/", home);
app.post("/update-request", updateRequest);

export default app;
