import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";
import { env } from "@src/env";

// Configure the SDK with auto-instrumentation
const sdk = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: env.OTEL_SERVICE_NAME,
    [ATTR_SERVICE_VERSION]: env.OTEL_SERVICE_VERSION
  }),
  traceExporter: new OTLPTraceExporter(),
  // @ts-expect-error -- OTLPMetricExporter types are not fully compatible yet
  metricExporter: new OTLPMetricExporter(),
  instrumentations: [getNodeAutoInstrumentations()]
});

// Start the SDK
sdk.start();

// Bun doesn't correctly handle process exit signals by default,
// so we need a way to properly shut down the SDK
const shutdownSignals = ["SIGTERM", "SIGINT", "SIGQUIT", "uncaughtException"];

// Gracefully shut down the SDK on termination signals
for (const signal of shutdownSignals) {
  process.on(signal, () => {
    sdk
      .shutdown()
      .then(() => console.log("OpenTelemetry SDK shut down successfully"))
      .catch(error => console.error("Error shutting down OpenTelemetry SDK", error))
      .finally(() => {
        if (signal !== "uncaughtException") {
          process.exit(0);
        }
      });
  });
}
