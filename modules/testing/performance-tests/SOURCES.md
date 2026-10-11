# Sources: Performance and load tests (fact-checked 2026-10-11)

- k6: acquired by Grafana Labs (17 Jun 2021); v1.0 (7 May 2025); v2.0.0 (11 May 2026); latest v2.3.0 (Sep 2026); thresholds; constant-arrival-rate (open model) executors. Apache JMeter 5.6.3 (Jan 2024). Gatling, Locust, Artillery.
- Coordinated omission: Gil Tene (wrk2, HdrHistogram).
- Core Web Vitals: INP replaced FID on 12 Mar 2024; good ≤200 ms at the 75th percentile (web.dev).
- 53%/3-second statistic (2016 Google/DoubleClick) weakly sourced, so not quoted; hedged wording used.
- Queueing model: M/M/1, W = S/(1−ρ), exponential sojourn time (p50 ≈ 0.69W, p95 ≈ 3W).

Full notes: scratchpad `sd/testing/m18-facts.md`. The API, its service times and budgets are made up and illustrative.
