# Sources: Observability platforms and cost (prices checked 2026-10-03)

Public US list prices, before discounts. Prices change often; the module date-stamps them.

- Datadog pricing list: https://www.datadoghq.com/pricing/list/ (Infra Pro $15 annual / $18 on-demand; APM $31 / $36; logs $0.10/GB ingest, $1.70 per 1M indexed events at 15 days, annual; custom metrics $5 per 100, 100 per Infra Pro host; 150 GB spans per APM host).
- Datadog Flex Logs: https://docs.datadoghq.com/logs/log_configuration/flex_logs/
- New Relic pricing: https://newrelic.com/pricing (100 GB free, $0.40/GB, Data Plus $0.60/GB; Pro full platform user $349 annual).
- Grafana Cloud pricing: https://grafana.com/pricing/ ($19 platform fee, $6.50 per 1k series with 10k included, logs and traces $0.05 + $0.40 + $0.10 per GB with 50 GB included).
- Grafana Adaptive Metrics: https://grafana.com/docs/grafana-cloud/adaptive-telemetry/adaptive-metrics/
- Honeycomb pricing: https://www.honeycomb.io/pricing (Pro from $150 per 50M events, unlimited seats).
- Elastic Cloud Serverless Observability: https://www.elastic.co/pricing/serverless-observability ("as low as" $0.09/GB ingested, Complete tier).
- AWS CloudWatch and X-Ray (Price List API, us-east-1): https://aws.amazon.com/cloudwatch/pricing/ (logs $0.50/GB; custom metrics $0.30 first 10k, $0.10 next 240k; OTel metrics $0.50/GB with no per-series charge; Logs Insights per GB scanned; X-Ray $5 per 1M traces stored, 100k free).
- Azure Monitor (Retail Prices API, eastus): https://azure.microsoft.com/en-us/pricing/details/monitor/ (Analytics Logs $2.30/GB, Basic $0.50/GB).
- Google Cloud Observability pricing: https://cloud.google.com/stackdriver/pricing (Logging $0.50/GiB after 50 GiB; Managed Prometheus $0.06 per 1M samples; Trace $0.20 per 1M spans after 2.5M).
- Loki README: https://github.com/grafana/loki ; Mimir README: https://github.com/grafana/mimir
- Grafana Labs Observability Survey 2026 (1,363 responses): https://grafana.com/observability-survey/ (cost 31% top concern; 65% selection criterion; 90% same or more spend; 28.7% mostly + 22.1% only self-managed; self-managed cite complexity, SaaS users cite cost).

Workload (20 hosts, 500 GB logs at ~1 KB/event, 50k series at 30 s scrape, 100 GB traces ≈ 100M spans / 10M traces) and lever percentages are illustrative.
