# Sizing and cost (Streaming Data Systems, module 19)

1. **Counters or plates** (analogy): catering by counter-hour vs per plate = capacity units vs per-GB; UPI ≈ 9.3 MB/s.
2. **How many partitions?** ⭐ (simulation): t, p, c sliders; max(t/p, t/c); producer vs consumer bound; headroom and partition limits.
3. **How much disk?** (calculator): throughput × retention × replication factor; tiered storage.
4. **Price it** ⭐ (simulation): 1/10/30 MB/s, 1–3 readers, US East vs Mumbai; six platforms' monthly list-price estimates; Event Hubs Standard 40-TU cap.
5. **The hidden bill** ⭐ (fix the problem): self-run Kafka cost breakdown; cross-zone traffic dominates; follower fetching.
6. **What grows the bill?** (sort checkpoint).
7. **Wrap**.
