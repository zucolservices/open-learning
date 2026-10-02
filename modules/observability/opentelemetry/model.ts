/** The path telemetry takes, frame by frame, and three backends to switch between. */

export type Part = "code" | "api" | "sdk" | "otlp" | "collector" | "backend";

export const FRAMES: { part: Part; title: string; text: string }[] = [
  {
    part: "code",
    title: "Your code and its libraries",
    text: "The payments service handles a request. Its web framework, database driver and HTTP client are already instrumented, and your own code marks the steps that matter to the business.",
  },
  {
    part: "api",
    title: "The API: what code calls",
    text: "Libraries and your code only talk to the OpenTelemetry API: start a span, add an attribute, record a measurement. If no SDK is installed, these calls do nothing, so libraries can include them safely.",
  },
  {
    part: "sdk",
    title: "The SDK: what the app wires up",
    text: "At start-up the app installs the SDK and decides the rest: which traces to sample, how to batch, where to send. It also stamps every signal with resource attributes such as service.name.",
  },
  {
    part: "otlp",
    title: "OTLP: one protocol for every signal",
    text: "Traces, metrics and logs leave the app in the OpenTelemetry Protocol, over gRPC (port 4317) or HTTP (port 4318).",
  },
  {
    part: "collector",
    title: "The Collector: a telemetry switchboard",
    text: "An OpenTelemetry Collector receives the data, processes it (batch it, drop noise, remove personal data) and exports it. It often runs as an agent beside each app and as a gateway per cluster or region.",
  },
  {
    part: "backend",
    title: "Any backend",
    text: "Exporters send the data wherever you choose: open-source tools or a vendor. Changing backend means changing the Collector's configuration, not your code.",
  },
];

export type Backend = "oss" | "vendor" | "cloud";

export const BACKENDS: Record<Backend, { name: string; config: string }> = {
  oss: {
    name: "Prometheus + Tempo + Loki",
    config: `exporters:
  otlphttp/prometheus:
    endpoint: http://prometheus:9090/api/v1/otlp
  otlp/tempo:
    endpoint: tempo:4317
  otlphttp/loki:
    endpoint: http://loki:3100/otlp`,
  },
  vendor: {
    name: "A commercial vendor",
    config: `exporters:
  otlphttp/vendor:
    endpoint: https://otlp.vendor.example
    headers:
      api-key: \${env:VENDOR_KEY}`,
  },
  cloud: {
    name: "Your cloud's monitoring",
    config: `exporters:
  otlphttp/cloud:
    endpoint: https://telemetry.cloud.example/v1
    auth:
      authenticator: cloud_identity`,
  },
};
