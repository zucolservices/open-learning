# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `streaming/m21-facts.md` (raw pages in `m21/`).

- ClickHouse docs (26.9): batch inserts of "at least 1,000 rows, and ideally between 10,000–100,000 rows", "around one insert query per second"; each synchronous insert creates a part immediately; async_insert flushes after 200 ms by default (1,000 ms on Cloud); Kafka table engine + materialized view, ClickPipes recommended on Cloud; primary index granules of 8,192 rows; Apache 2.0. https://clickhouse.com/docs/best-practices/selecting-an-insert-strategy
- Apache Druid 38.0.0 (1 Oct 2026): Kafka/Kinesis supervisors with exactly-once ingestion; "Data is queryable as soon as it is added to an uncommitted segment"; time chunks; rollup "summarization or pre-aggregation"; "sub-second to a few seconds" queries. https://druid.apache.org/docs/latest/ingestion/
- Apache Pinot 1.5.1: real-time tables from Kafka, Kinesis, Pulsar, queryable "within seconds of publication"; upserts; star-tree and inverted indexes; pauseless consumption in 1.4.0. https://docs.pinot.apache.org/
- LinkedIn Engineering (2015) on Pinot: "1000's of queries per second", 25+ products incl. Who Viewed My Profile. Uber Engineering (2017): Restaurant Manager on Pinot, p99 < 100 ms at 1,000 QPS on three servers.
- Zomato Engineering blog (20 Jul 2023): logging on ClickHouse, 150 million logs/minute, 50+ TB/day, batches of up to 20,000 messages "ensuring a maximum lag of 5 seconds"; earlier S3 + Trino approach lagged 5–10 minutes. https://www.zomato.com/blog/building-a-cost-effective-logging-platform-using-clickhouse-for-petabyte-scale/
- Elasticsearch default refresh interval 1 s. Snowpipe Streaming: "As low as 5 seconds ingest-to-queryable latency". Snowflake dynamic tables: "The minimum target lag is 60 seconds." Redpanda Iceberg Topics 1-minute target lag; Iceberg Kafka Connect sink 5-minute commit interval (module 20).
- Azure Data Explorer / Fabric Eventhouse default batching policy: 5 minutes, 500 items, 1 GB. Redshift streaming ingestion materialized views; BigQuery Storage Write API and continuous queries; StarRocks/Doris Routine Load; Tinybird.
- Rockset acquired by OpenAI (21 Jun 2024), service wound down by 30 Sep 2024. Amazon Timestream for LiveAnalytics closed to new customers 20 Jun 2025.
- The query-pruning walk-through (1 billion rows, 40 columns, etc.) is illustrative.
