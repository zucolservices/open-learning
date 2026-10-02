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
  counter: {
    term: "Counter",
    definition:
      "A metric that only goes up (or resets to zero when the process restarts), such as total requests. You almost always look at its rate: how fast it's increasing.",
    module: "metric-types",
  },
  gauge: {
    term: "Gauge",
    definition:
      "A metric that can go up and down, such as memory in use, queue length or requests in flight.",
    module: "metric-types",
  },
  histogram: {
    term: "Histogram",
    definition:
      "A metric that sorts each measurement (say, a request's duration) into buckets and counts them, so you can work out percentiles across many servers.",
    module: "metric-types",
  },
  prometheus: {
    term: "Prometheus",
    definition:
      "The most widely used open-source metrics system: it scrapes metrics from apps, stores them as time series and queries them with PromQL. A CNCF graduated project, started at SoundCloud in 2012.",
    module: "metric-types",
  },
  percentile: {
    term: "Percentile (p50, p95, p99)",
    definition:
      "The value below which a given share of measurements fall: p99 latency of 800 ms means 99% of requests were at least that fast and 1% slower. p50 is the median, the typical case.",
    module: "percentiles",
  },
  "tail-latency": {
    term: "Tail latency",
    definition:
      "The response times of the slowest requests, such as p99 or p99.9. Averages hide it, and systems that fan out to many servers amplify it.",
    module: "percentiles",
  },
  cardinality: {
    term: "Cardinality",
    definition:
      "The number of distinct values a label can take, and so the number of time series a metric creates (the product across its labels). High-cardinality labels, like user IDs, can overwhelm a metrics system and its bill.",
    module: "cardinality",
  },
  "time-series": {
    term: "Time series",
    definition:
      "One sequence of measurements over time for a metric with one specific set of label values, such as requests for route /pay with status 2xx. Metrics systems store and bill per series.",
    module: "cardinality",
  },
  label: {
    term: "Label (metric attribute)",
    definition:
      "A name–value pair attached to a metric, such as route=/pay, that lets you slice it. Every combination of label values becomes a separate time series.",
    module: "cardinality",
  },
  "golden-signals": {
    term: "Golden signals",
    definition:
      "The four measurements Google's SRE book recommends for any user-facing service: latency, traffic, errors and saturation.",
    module: "golden-signals",
  },
  saturation: {
    term: "Saturation",
    definition:
      "How full a service or resource is (CPU, memory, connections, disk), especially the most constrained one. Rising latency is often an early sign of it.",
    module: "golden-signals",
  },
  "red-method": {
    term: "RED method",
    definition:
      "Tom Wilkie's checklist for request-driven services: Rate (requests per second), Errors (failed requests per second) and Duration (how long requests take).",
    module: "golden-signals",
  },
  "use-method": {
    term: "USE method",
    definition:
      "Brendan Gregg's checklist for resources such as CPUs, disks and network links: Utilisation, Saturation and Errors.",
    module: "golden-signals",
  },
  "structured-log": {
    term: "Structured log",
    definition:
      "A log record written as named fields (usually JSON), such as time, level, message, order_id and trace_id, rather than a free-text sentence, so machines can filter, count and join it.",
    module: "structured-logging",
  },
  "correlation-id": {
    term: "Correlation ID",
    definition:
      "An identifier carried through every service a request touches and written on every log line and span, usually the trace ID, so all the records of one request can be found together.",
    module: "structured-logging",
  },
  "log-level": {
    term: "Log level (severity)",
    definition:
      "How serious a log record is: TRACE, DEBUG, INFO, WARN, ERROR or FATAL. Levels let you filter noise and keep costs down.",
    module: "structured-logging",
  },
  "log-pipeline": {
    term: "Log pipeline",
    definition:
      "The chain that collects logs from every machine, processes them (parse, filter, sample, redact) and delivers them to storage you can search: for example Fluent Bit or the OpenTelemetry Collector feeding Loki or Elasticsearch.",
    module: "log-pipelines",
  },
  retention: {
    term: "Retention",
    definition:
      "How long telemetry is kept, and how quickly it can be searched. Teams often keep recent data hot and move older data to cheaper tiers or archives.",
    module: "log-pipelines",
  },
  "context-propagation": {
    term: "Context propagation",
    definition:
      "Passing the trace ID and current span ID from one service to the next with each call (usually in the W3C traceparent header), so all their spans join the same trace.",
    module: "distributed-tracing",
  },
  traceparent: {
    term: "traceparent header",
    definition:
      "The W3C Trace Context header that carries a trace's ID, the calling span's ID and a sampling flag between services, for example 00-4bf9…4736-00f0…02b7-01.",
    module: "distributed-tracing",
  },
  "critical-path": {
    term: "Critical path (trace)",
    definition:
      "The chain of spans a request actually had to wait for. Shortening a span on it shortens the request; speeding up work that runs in parallel off it doesn't.",
    module: "distributed-tracing",
  },
  "head-sampling": {
    term: "Head sampling",
    definition:
      "Deciding whether to keep a trace when it starts, usually by a random choice based on its trace ID. Cheap and simple, but it can't favour traces that later turn out to fail or be slow.",
    module: "trace-sampling",
  },
  "tail-sampling": {
    term: "Tail sampling",
    definition:
      "Deciding whether to keep a trace after it has finished, so you can keep every error and slow request and only a share of the rest. Needs all of a trace's spans in one place and some memory.",
    module: "trace-sampling",
  },
  profile: {
    term: "Profile",
    definition:
      "A record of where a program spends its CPU time, memory or waiting, built by sampling its call stack many times a second, so you can see which functions cost the most.",
    module: "profiling",
  },
  "flame-graph": {
    term: "Flame graph",
    definition:
      "Brendan Gregg's picture of a profile: each block is a function sitting on top of its caller, and its width is how often it appeared in the samples. The x-axis is not time.",
    module: "profiling",
  },
  "continuous-profiling": {
    term: "Continuous profiling",
    definition:
      "Running a low-overhead profiler in production all the time and storing the results, so you can look at what the code was doing at any moment, such as during an incident.",
    module: "profiling",
  },
  sli: {
    term: "SLI (service level indicator)",
    definition:
      "A measurement of how well a service is working for its users, usually a ratio: good events divided by total events, such as the share of payments that succeed within 2 seconds.",
    module: "slis-slos",
  },
  slo: {
    term: "SLO (service level objective)",
    definition:
      "A target for an SLI over a time window, such as 99.9% of payments succeeding within 2 seconds over four weeks. Never 100%.",
    module: "slis-slos",
  },
  sla: {
    term: "SLA (service level agreement)",
    definition:
      "A promise to customers about service levels, with consequences such as refunds or credits if it's missed. Usually looser than the internal SLO.",
    module: "slis-slos",
  },
  "error-budget": {
    term: "Error budget",
    definition:
      "The amount of unreliability an SLO allows (1 − the target): at 99.9% over four weeks with 3 million requests, 3,000 bad requests. Teams spend it on releases and experiments, and slow down when it runs out.",
    module: "error-budgets",
  },
  "burn-rate": {
    term: "Burn rate",
    definition:
      "How fast the error budget is being used compared with the steady rate that would use it up exactly over the SLO window. A burn rate of 14.4 uses 2% of a 30-day budget in an hour.",
    module: "error-budgets",
  },
  "error-budget-policy": {
    term: "Error budget policy",
    definition:
      "An agreement, made in advance, about what a team does when its error budget runs low or out, such as pausing risky releases and prioritising reliability fixes.",
    module: "error-budgets",
  },
} satisfies Record<string, GlossaryEntry>;
