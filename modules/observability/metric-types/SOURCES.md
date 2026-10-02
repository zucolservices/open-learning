# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `obs/m04-facts.md` (raw pages in `obs/m03/`, `obs/m04/`).

- Prometheus docs, metric types: a counter "can only increase or be reset to zero on restart"; a gauge "can arbitrarily go up and down"; a histogram "records observations … by counting them in configurable buckets … essentially a bucketed counter"; summaries calculate quantiles per instance.
- Prometheus docs, querying: rate() handles counter resets; "always take a rate() first, then aggregate". Histograms practices page: prefer native histograms over classic histograms and summaries. Native histograms stable in v3.8.0 (Dec 2025), opt-in.
- Prometheus configuration: global scrape interval default 1m; example configuration 15s. Pushgateway intended for service-level batch jobs. Prometheus 3.0 (14 Nov 2024) OTLP receiver behind `--web.enable-otlp-receiver`.
- Prometheus history: SoundCloud 2012; CNCF May 2016 (second project); graduated 9 Aug 2018.
- OpenTelemetry metric instruments: Counter, UpDownCounter, Gauge, Histogram (and asynchronous variants).
- The simulated server, its traffic and the /metrics sample are illustrative.
