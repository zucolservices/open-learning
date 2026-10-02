# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `obs/m06-facts.md` (raw pages in `obs/m05/`).

- Prometheus docs, metric and label naming: "every unique combination of key-value label pairs represents a new time series … Do not use labels to store dimensions with high cardinality (many different label values), such as user IDs, email addresses, or other unbounded sets of values." Instrumentation practices: most metrics should have no labels; keep cardinality below 10 as a general guideline; above 100, consider other solutions.
- Prices read 3 October 2026 (list, US): Grafana Cloud metrics $6.50 per 1,000 active series, 10,000 included; Datadog $5 per 100 custom metrics per month (allowances of 100 per host on Pro, 200 on Enterprise); Amazon CloudWatch $0.30 per custom metric per month for the first 10,000, volume tiers after (lowest $0.02). CloudWatch treats each unique combination of dimensions as a separate metric.
- OpenTelemetry metrics SDK spec: views with attribute allow-lists; default cardinality limit 2000 with an overflow series (`otel.metric.overflow=true`).
- Datadog Metrics without Limits; Grafana Adaptive Metrics; Honeycomb: group or filter on any attribute regardless of cardinality.
- The label value counts and costs for a single metric are illustrative calculations.
