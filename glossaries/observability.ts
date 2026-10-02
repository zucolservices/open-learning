import type { GlossaryEntry } from "./types";

/** Observability track glossary. `module` slugs refer to this track. */
export const observability = {
  observability: {
    term: "Observability",
    definition:
      "How well you can understand what a running system is doing, and why, from the data it sends out, including problems nobody predicted. The term comes from control theory (Kálmán, 1960).",
    module: "why-observability",
  },
  monitoring: {
    term: "Monitoring",
    definition:
      "Collecting and displaying data about a system and alerting on conditions you know matter, such as error rates or full disks. It answers questions you thought of in advance.",
    module: "why-observability",
  },
  telemetry: {
    term: "Telemetry",
    definition:
      "Data a running system sends out about itself, mainly metrics, logs and traces (and increasingly profiles), so people and tools can see what it is doing.",
    module: "why-observability",
  },
  metric: {
    term: "Metric",
    definition:
      "A number measured over time, such as requests per second, error count or memory in use. Cheap to store and fast to query, but it summarises away the details of individual events.",
    module: "signals-overview",
  },
  log: {
    term: "Log",
    definition:
      "A timestamped record of one event, written by a program: a request handled, an error, a payment refused. Detailed and flexible, but bulky and expensive at volume.",
    module: "structured-logging",
  },
  trace: {
    term: "Trace",
    definition:
      "The record of one request's journey through a system, made of spans (one per operation) with their start and end times, so you can see where the time went.",
    module: "distributed-tracing",
  },
  span: {
    term: "Span",
    definition:
      "One timed operation within a trace, such as a call to another service or a database query, with a start time, an end time, attributes and a link to its parent span.",
    module: "distributed-tracing",
  },
  exemplar: {
    term: "Exemplar",
    definition:
      "A sample trace ID attached to a metric data point, so you can jump from a spike on a graph to an example request that contributed to it.",
    module: "signals-overview",
  },
  "semantic-conventions": {
    term: "Semantic conventions",
    definition:
      "OpenTelemetry's standard names for common attributes, such as http.request.method or db.system.name, so data from different libraries and tools means the same thing.",
    module: "signals-overview",
  },
  instrumentation: {
    term: "Instrumentation",
    definition:
      "Code (added by hand or automatically by an agent) that makes a program record telemetry: spans, metrics and logs about what it is doing.",
    module: "opentelemetry",
  },
  opentelemetry: {
    term: "OpenTelemetry (OTel)",
    definition:
      "The open, vendor-neutral standard and toolkit for producing telemetry (traces, metrics, logs and profiles): APIs and SDKs for many languages, the OTLP protocol and the Collector. A CNCF project, graduated in 2026.",
    module: "opentelemetry",
  },
  otlp: {
    term: "OTLP",
    definition:
      "The OpenTelemetry Protocol, used to send traces, metrics and logs from apps to collectors and backends, over gRPC (port 4317) or HTTP (port 4318).",
    module: "opentelemetry",
  },
  "otel-collector": {
    term: "OpenTelemetry Collector",
    definition:
      "A program that receives telemetry, processes it (batching, filtering, removing personal data) and exports it to one or more backends, configured as pipelines of receivers, processors and exporters.",
    module: "opentelemetry",
  },
  "auto-instrumentation": {
    term: "Zero-code (automatic) instrumentation",
    definition:
      "Telemetry added without changing your code, by an agent or launcher that instruments common libraries such as web frameworks, database drivers and HTTP clients.",
    module: "opentelemetry",
  },
} satisfies Record<string, GlossaryEntry>;
