import "./otel";

import { isVercel } from "@dns-markdown/env";

import { env } from "./env";
import app from "./server";

// Vercel runs the exported app itself; everywhere else start the server
if (!isVercel()) {
  app.listen(env.PORT, () => console.log(`Listening on ${env.PORT}`));
}

export default app;
