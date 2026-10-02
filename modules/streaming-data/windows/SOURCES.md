# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `streaming/m13-facts.md` (raw pages in `m13raw/`).

- Flink 2.3 DataStream windows: tumbling, sliding (size + slide), session, global; triggers, evictors; allowedLateness default 0; sideOutputLateData; late firings are "updated results … you need to take these duplicated results into account or deduplicate them". Flink SQL windowing TVFs TUMBLE, HOP(table, descriptor, slide, size), CUMULATE, SESSION (1.19+); window aggregations "do not emit intermediate results"; hopping windows "also known as sliding windows".
- Kafka Streams 4.3: TimeWindows (tumbling when advance = size, hopping when advance < size); SlidingWindows (2.7, KIP-450: "a new window is created each time a record enters the sliding window or a record drops out", both ends inclusive, aligned to records); SessionWindows; explicit grace since 3.0 (KIP-633), old constructors removed in 4.0; EmitStrategy onWindowClose (3.3, KIP-825), default emit on update; suppress(untilWindowCloses).
- Spark 4.2: window(timeColumn, windowDuration[, slideDuration]); session_window (3.2.0) static or per-row gap; session windows not supported in update mode for streaming and need another grouping column.
- Beam: FixedWindows, SlidingWindows (size, period), Sessions, GlobalWindows; triggers with early/late firings; allowed lateness; accumulating vs discarding.
- ksqlDB: TUMBLING, HOPPING, SESSION; GRACE PERIOD (defaults to 24 hours, "Set this value explicitly"); EMIT CHANGES / EMIT FINAL. Confluent recommends Confluent Platform for Apache Flink for new workloads; ksqlDB remains supported.
- Engines create a window only when an event falls into it. size/advance windows per event holds exactly when size is a multiple of advance (10/5 → 2).
- Clicks and the late-data example are illustrative; the late-data walkthrough follows Kafka Streams' grace-period and emit rules.
