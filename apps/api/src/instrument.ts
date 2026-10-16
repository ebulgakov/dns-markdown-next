import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://253c19d32e19b2b3addbd2fcec26335e@o4510680847220736.ingest.de.sentry.io/4510805604171856",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});
