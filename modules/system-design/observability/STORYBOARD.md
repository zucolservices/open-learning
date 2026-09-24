# Observability & SLOs: storyboard

1. **Three ways to see** ⭐ Car analogy (gauges, service history, journey map). One slow checkout seen as a p99 latency chart, structured log lines sharing a trace ID, and a mini trace.
2. **Follow one request** ⭐ (step-through). Waterfall of 7 spans (web → checkout → inventory ∥ pricing → tax → tax_rates query; then payment). Frames: whole request, nesting, parallel vs sequential / critical path, the slow query (4.8M rows scanned, missing index), traceparent propagation. Click spans for attributes.
3. **Which signal?** (sort: metrics / logs / traces). Golden signals, RED, USE.
4. **Spend the error budget** ⭐ (simulation, `slo.ts`). 30 days at 1,000 requests/min with a bad deploy, a 4-minute blip and a 2-day slow leak. SLO 99–99.95%; budget-left line; naive ">1% for 5 min" vs SRE Workbook multi-window burn-rate alerts (14.4× 1 h/5 min page, 6× 6 h/30 min page, 1× 3 d/6 h ticket); per-incident detection. The naive rule misses the slow leak.
5. **Observability tools**: OpenTelemetry, open source, AWS, Azure, Google Cloud, commercial.
6. **What to remember**.
