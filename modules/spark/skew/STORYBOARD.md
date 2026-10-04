# Storyboard: Data skew

1. **The canteen queue** (story): queues by surname letter; one huge queue.
2. **One key, one slow task** ⭐ (simulation): hot-key share, AQE skew join or salting; task bars, summary quantiles, stage time.
3. **Spotting skew** (explore): 199/200 tasks; counting rows per key; NULLs.
4. **Fixes, in order** (explore): junk keys, broadcast, AQE, salting (join and aggregation code).
5. **The marketplace merchant** (checkpoint `merchant-skew`).
6. **What to remember** (wrap).
