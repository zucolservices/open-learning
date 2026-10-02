# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `streaming/m08-facts.md`.

- Debezium 3.7 (29 Sep 2026); joined the Commonhaus Foundation (announced 4 Nov 2024). Connectors: MySQL binlog (binlog_format=ROW, binlog_row_image=FULL); PostgreSQL logical decoding (wal_level=logical, replication slots, pgoutput); SQL Server via its CDC change tables; Oracle via LogMiner (default), XStream or OpenLogReplicator; MongoDB change streams. Event envelope: before, after, source, op (c, u, d, r, t, m), ts_ms (connector processing time) vs source.ts_ms (database change time). snapshot.mode initial; incremental snapshots with signalling table and watermarks, inspired by Netflix DBLog (Netflix blog Dec 2019; arXiv:2010.12597).
- Gunnar Morling, "Reliable Microservices Data Exchange With the Outbox Pattern" (Debezium blog, 19 Feb 2019): dual-write failure modes; outbox insert + delete in the same transaction; Outbox Event Router (topic outbox.event.<aggregatetype>, aggregateid as key, id header). microservices.io transactional outbox (ordering, possible duplicate publishing).
- Delivery: at-least-once by default; exactly-once via KIP-618 (Kafka Connect 3.3.0+, distributed) for MariaDB, MongoDB, MySQL, Oracle, PostgreSQL, SQL Server, with Debezium noting "it remains unclear whether the implementation is fully correct".
- PostgreSQL: replication slots retain WAL even with no consumer; max_slot_wal_keep_size (PG 13+, default −1 = unlimited); idle_replication_slot_timeout (PG 18). Debezium heartbeat.interval.ms / heartbeat.action.query.
- Managed: AWS DMS ("AWS DMS CDC does not provide real-time replication"; targets Kinesis, Kafka, MSK); Google Datastream (MySQL, PostgreSQL, Oracle, SQL Server, MongoDB, Spanner, Salesforce…; to BigQuery, Cloud Storage, Iceberg); Azure Data Factory CDC; Debezium with Event Hubs Kafka endpoint; Confluent Cloud managed Debezium connectors; Apache Flink CDC (donated by Ververica, first Apache release 3.1.0 May 2024; 3.6.0 Mar 2026).
- Razorpay: Aurora MySQL → Debezium → Kafka Streams → Amazon MSK (AWS Big Data Blog, 13 Jul 2026; vendor case study).
- The order #5021 scenarios and the sample change event are illustrative.
