# Batch vs streams (Streaming Data Systems, module 1)

1. **A payment at 11:42 pm** (scroll story): stolen PIN, 20 payments in 10 minutes; nightly batch at 2 am finds it too late; per-event check blocks the third payment; bounded (book) vs unbounded (river); UPI scale (~9,300/s, FY25 fraud figures).
2. **How often do you look?** ⭐ (simulation): same rule under nightly / hourly / 5-minute / per-event checking; timeline and money lost; Dataflow batch vs streaming prices.
3. **The latency ladder** (explore): days → milliseconds with examples and engines; micro-batch; Visa.
4. **How we got here** (step-through): 2011 Kafka/Lambda → 2013 The Log → 2014 Kappa → 2015 Flink/Dataflow → 2016–17 Structured Streaming/Beam → 2025 Kafka 4.0, Spark Real-Time Mode → 2026 IBM–Confluent.
5. **Batch or stream?** (sort checkpoint).
6. **Wrap**.
