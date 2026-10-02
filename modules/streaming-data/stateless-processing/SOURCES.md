# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `streaming/m11-facts.md`.

- Kafka Streams 4.3 (Kafka 4.3.1, 25 Jun 2026): client library; processor topology definition; stateless DSL operations (filter, filterNot, map, mapValues, flatMap, selectKey, merge, peek, foreach, groupBy, to with TopicNameExtractor); split()/Branched since 2.8 (KIP-418), branch() deprecated then removed in 4.0 (also through(), transform/transformValues); key-changing operations mark the stream for repartitioning, which happens when a grouping or join follows; "mapValues is preferable to map because it will not cause data re-partitioning".
- Apache Flink 2.3.0 (25 Jun 2026; 2.0 Mar 2025): map, flatMap, filter, keyBy, side outputs, operator chaining; DataSet API removed in 2.0. Amazon Managed Service for Apache Flink (renamed 30 Aug 2023; Flink 2.2/2.3), Confluent Cloud for Apache Flink, Alibaba Realtime Compute for Apache Flink; Google BigQuery Engine for Apache Flink (Preview); Azure HDInsight on AKS (with Flink) retired 31 Jan 2025.
- Spark 4.2.0 (14 Jul 2026): stream as "a table that is being continuously appended"; foreachBatch; Real-Time Mode in 4.1 (Scala, stateless; PySpark in 4.2). Apache Beam 2.76.0: ParDo, Filter, Map, Partition (fixed number of outputs); runners Dataflow, Flink, Spark.
- Kafka Connect SMTs: "lightweight message-at-a-time modifications… convenient for data massaging and event routing"; built-in predicates TopicNameMatches, HasHeaderKey, RecordIsTombstone; RegexRouter, TimestampRouter route by topic name/timestamp.
- Serverless: Lambda event filtering (26 Nov 2021), EventBridge Pipes (1 Dec 2022), Azure Functions Event Hubs trigger, Cloud Run functions (renamed 22 Aug 2024), Pub/Sub attribute-only subscription filters and single message transforms (JavaScript UDFs, AI Inference).
- Martin Kleppmann, "Should You Put Several Event Types in the Same Kafka Topic?" (Confluent blog, 18 Jan 2018).
- The payment events, masking and topology are illustrative; code snippets are trimmed sketches.
