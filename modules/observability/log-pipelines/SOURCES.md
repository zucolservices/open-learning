# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `obs/m09-facts.md` (raw pages in `obs/m09/`).

- Kubernetes docs, logging architecture: the container runtime writes stdout/stderr to files under `/var/log/pods` by default; node-level agents usually run as a DaemonSet.
- Fluent Bit: "CNCF graduated project under the Fluent organization" (Fluentd graduated 11 Apr 2019). Grafana Agent end of life 1 Nov 2025; Promtail end of life 2 Mar 2026; Grafana Alloy is Grafana's OpenTelemetry Collector distribution. Vector maintained by Datadog.
- Grafana Loki docs: Loki "does not index the contents of the logs, but only indexes metadata about your logs as a set of labels for each log stream." Elasticsearch ILM tiers: hot, warm, cold, frozen. ClickStack (ClickHouse + HyperDX + OTel Collector).
- List prices read 3 October 2026 (US East, USD): Amazon CloudWatch Logs Standard $0.50/GB ingest, Infrequent Access $0.25/GB, storage $0.03/GB-month; Datadog $0.10/GB ingest and $1.70 per million events indexed (15-day retention); Grafana Cloud Logs $0.05/GB process + $0.40/GB write + $0.10/GB retain, 50 GB a month included.
- OpenTelemetry Collector processors: filter, transform, attributes, redaction, probabilistic_sampler, tail_sampling, logdedup.
- The daily volumes, DEBUG and health-check shares and the one-million-events-per-GB assumption are illustrative.
