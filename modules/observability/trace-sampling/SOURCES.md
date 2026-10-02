# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `obs/m11-facts.md` (raw pages in `obs/m11/`).

- OpenTelemetry docs, sampling: head sampling decides "as early as possible … not made by inspecting the trace as a whole"; tail sampling considers all or most spans of a trace. SDK default sampler ParentBased(root=AlwaysOn). TraceIdRatioBased deprecated in favour of the composable ProbabilitySampler (Development); consistent probability sampling (tracestate `th`) in development.
- OpenTelemetry Collector contrib: tail_sampling processor (decision_wait default 30s, num_traces default 50,000; policies including status_code, latency, probabilistic, rate_limiting, string_attribute, ottl_condition, and, composite); load_balancing exporter routing by trace ID (renamed from loadbalancing); span_metrics connector (renamed from spanmetrics).
- OpenMetrics: exemplars are "references to data outside of the MetricSet", such as trace IDs.
- Datadog: "APM Metrics are always calculated based on all traces"; retention filters keep errors and high-latency traces. Honeycomb Refinery: keep 100% of traces with an error.
- Sigelman et al., Dapper (2010): "one sampled trace for every 1024 candidates".
- The 10,000 traces, their error and slow shares and the complaint trace are illustrative.
