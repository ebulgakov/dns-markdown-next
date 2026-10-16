import "./otel";

import { env } from "./env";
import app from "./server";

if (env.NODE_ENV !== "production") {
  app.listen(env.PORT, () => console.log(`Listening on ${env.PORT}`));
}

export default app;
