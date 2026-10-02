# Averages lie: percentiles (Observability, module 5)

1. **Where the average hides** ⭐ (simulation): 1,000 latencies; one in twenty 20× slower; average vs p50/p95/p99 and the histogram.
2. **The tail at scale** (explore): fan-out to N servers; 1 − 0.99^N; Dean & Barroso.
3. **Never average percentiles** (explore): two servers, traffic split; averaged p99 vs true p99; combine histogram buckets.
4. **The calm average** (choice checkpoint).
5. **Wrap**: Google 2009, Linden's Amazon figure.
