# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `obs/m05-facts.md` (raw pages in `obs/m05/`).

- Google, _Site Reliability Engineering_, ch. 4: "Using percentiles for indicators allows you to consider the shape of the distribution"; "although a typical request is served in about 50 ms, 5% of requests are 20 times slower!"
- Jeffrey Dean & Luiz André Barroso, "The Tail at Scale", CACM, Feb 2013: servers typically 10 ms with a 99th percentile of 1 s; with 100 servers, 63% of user requests take over a second.
- Prometheus docs, histograms and summaries: "averaging the quantiles yields statistically nonsensical values"; histogram_quantile() interpolates within buckets; native histograms are more accurate.
- Jake Brutlag, "Speed Matters" (Google Research blog, 23 Jun 2009): 100–400 ms delays reduced searches by 0.2%–0.6%; effects persisted after the delay was removed.
- Greg Linden, Stanford talk slides (29 Nov 2006): "+100 ms -1% sales @ Amazon" (Amazon itself has not published this).
- All latencies and the two-server traffic split are illustrative.
