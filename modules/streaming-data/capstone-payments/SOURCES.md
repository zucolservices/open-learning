# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `streaming/m23-facts.md`; most technical claims reuse the fact-checks of modules 3, 5, 9, 10, 12–15, 17–21.

- Kafka replication (module 5): RF 3, min.insync.replicas=2, acks=all survives one broker failure without losing acknowledged writes; RF 1 partitions go offline with their broker; acks=1 can lose acknowledged writes on leader failure. Producers default to acks=all since Kafka 3.0.
- Confluent Schema Registry (module 9): BACKWARD is the default; for Avro, adding a field with a default or deleting a field passes, adding a field without a default fails, so a rename (delete + add without default) is rejected.
- Flink exactly-once (module 15): checkpoints + transactional Kafka sink + read_committed consumers; at-least-once replays since the last checkpoint, so non-idempotent sinks see duplicates. Allowed lateness defaults to 0 (module 13).
- UPI: 24.07 billion transactions in September 2026 (press citing NPCI), ~9,300/s on average (derived).
- Razorpay engineering blog (23 Sep 2019): "Apache Flink as our core engine, Kafka as data queue and control stream" for "Fraud detection, Smart routing, forecasting". https://razorpay.com/unfiltered/data-science-at-scale-using-apache-flink/ . AWS Big Data Blog with Razorpay (13 Jul 2026): Amazon MSK + Flink anomaly detection, 5 billion events a day, detection in under 30 s. https://aws.amazon.com/blogs/big-data/how-razorpay-built-real-time-anomaly-detection-with-amazon-msk/
- The payments app, its traffic, the failures and their outcomes are an illustrative scenario.
