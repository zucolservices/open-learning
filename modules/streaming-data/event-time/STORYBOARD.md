# Event time vs processing time (Streaming Data Systems, module 12)

1. **Postmarks and delivery dates** (analogy): postcards sorted by arrival vs postmark.
2. **Replay an hour of payments** ⭐ (simulation, seeded data): 5-minute windows; count by arrival time (wrong) vs by event time with a bounded-out-of-orderness watermark (0–20 min) and a clock slider; watermark value, late events dropped, average wait for results; true counts as dashed outlines.
3. **Watermarks in each engine** (explore): Flink (≤ and −1 ms, per-partition minimum, withIdleness), Kafka Streams (stream time, explicit grace since 4.0), Spark (withWatermark, per trigger), Beam/Dataflow.
4. **When watermarks go wrong** (step-through): too slow, too fast, idle partition, bad clocks, replays.
5. **Event time or processing time?** (sort checkpoint).
6. **Wrap**.
