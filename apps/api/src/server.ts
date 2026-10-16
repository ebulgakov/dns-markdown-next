import { clerkMiddleware } from "@clerk/express";
import * as Sentry from "@sentry/node";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import analysisRoutes from "./analysis-routes";
import clerkRoutes from "./clerk-routes";
import { env, isDev, isTestEnv } from "./env";
import llmRoutes from "./llm-routes";
import { authServiceMiddleware, authPublicMiddleware } from "./middleware/auth-middleware";
import { ensureDbConnectionMiddleware } from "./middleware/db-connection-middleware";
import { openApiSpec } from "./openapi";
import {
  swaggerUiBundleJs,
  swaggerUiCss,
  swaggerUiStandalonePresetJs
} from "./openapi/docs-assets";
import priceListRoutes from "./pricelist-routes";
import productsRoutes from "./products-routes";
import serviceRoutes from "./service-routes";
import userActionsRoutes from "./user-routes";

import "./instrument";

import type { NextFunction, Request, Response } from "express";
const app = express();

// Add logging middleware
app.use(morgan("dev", { skip: () => isTestEnv() }));

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    allowedHeaders: ["Content-Type", "Authorization", "X-Internal-API-Secret"],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true
  })
);

// Swagger UI needs its own relaxed CSP (inline script/style), so it's excluded from the
// default helmet() applied to every other route.
app.use((req, res, next) => {
  if (req.path === "/docs" || req.path.startsWith("/docs/")) return next();
  return helmet()(req, res, next);
});

// Set limit to 20MB
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Use a raw body parser for the Cleak webhook route
app.use("/clerk/create-user", express.raw({ type: "application/json" }));

app.use(ensureDbConnectionMiddleware);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "DNS Markdown API"
  });
});

// All public-facing routes will be under /api
app.use("/api", clerkMiddleware());
// Internal API authentication middleware
app.use("/api", authPublicMiddleware);

// Routes for data fetching (pricelist, products, analysis)
app.use("/api/pricelist", priceListRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/llm", llmRoutes);
app.use("/api/user", userActionsRoutes);

// API docs (Swagger UI). The page itself is static (spec embedded inline); actual
// /api calls made via "Try it out" still require X-Internal-API-Secret, entered
// through the Authorize dialog. Access to this URL in production relies on
// Vercel Deployment Protection rather than app-level auth, since a custom header
// can't gate a plain browser page load.
app.use(
  "/docs",
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": ["'self'", "'unsafe-inline'"],
        "style-src": ["'self'", "'unsafe-inline'"]
      }
    }
  }),
  // swaggerUi.serve reads these files from swagger-ui-dist's on-disk location at
  // runtime, which Vercel's serverless bundler doesn't trace/include (it only
  // follows static import/require calls, not express.static's directory scans).
  // Serving them from content embedded in the bundle at build time sidesteps
  // that entirely.
  (req: Request, res: Response, next: NextFunction) => {
    if (req.path === "/swagger-ui.css") return res.type("text/css").send(swaggerUiCss);
    if (req.path === "/swagger-ui-bundle.js") {
      return res.type("application/javascript").send(swaggerUiBundleJs);
    }
    if (req.path === "/swagger-ui-standalone-preset.js") {
      return res.type("application/javascript").send(swaggerUiStandalonePresetJs);
    }
    return next();
  },
  swaggerUi.serve,
  swaggerUi.setup(openApiSpec)
);

// Clerk webhooks
app.use("/clerk", clerkRoutes);

// Internal service routes
app.use("/service", authServiceMiddleware);
app.use("/service", serviceRoutes);

Sentry.setupExpressErrorHandler(app);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Internal Server Error", ...(isDev() && { details: err.message }) });
});

export default app;
