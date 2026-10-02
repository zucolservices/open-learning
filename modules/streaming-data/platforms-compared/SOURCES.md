# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `streaming/m07-facts.md`. Prices: AWS Price List API (published 2026-09-11), Azure Retail Prices API, vendor pricing pages, fetched 2026-10-02.

- Apache Kafka 4.3.1 (25 Jun 2026), Apache 2.0, KRaft-only.
- Redpanda: C++, Raft per partition, single binary; Community Edition under BSL 1.1 (converts to Apache 2.0 after four years); Serverless in AWS Mumbai; Serverless list prices from Redpanda's March 2025 blog ($0.10/h, $0.045/GB in, $0.04/GB out, $0.0015/partition-hour).
- Apache Pulsar 4.0 LTS (4.0.13); brokers + BookKeeper; multi-tenancy, geo-replication; StreamNative.
- Amazon MSK: kafka.m7g.large $0.1458/h Mumbai vs $0.204 us-east-1; Express m7g.large $0.2916 vs $0.408; MSK Serverless Mumbai $0.79/cluster-hour, $0.0016/partition-hour, $0.11/GB in, $0.056/GB out (us-east-1 $0.75, $0.0015, $0.10, $0.05).
- Confluent Cloud (IBM since 17 Mar 2026): Standard $0.75/eCKU-hour + $0.035–0.05/GB; Freight lacks idempotent producers and transactions; Freight in AWS Mumbai.
- Google Managed Service for Apache Kafka: GA 12 Nov 2024; $0.09/DCU-hour us-central1; asia-south1 and asia-south2. Pub/Sub: $40/TiB after 10 GiB free; Pub/Sub Lite closed to new customers 24 Sep 2024, shuts down 31 Jan 2027.
- Azure Event Hubs: Standard $0.03/TU-hour + $0.028 per million events; Premium $1.438/PU-hour Central India ($1.027 eastus); Kafka endpoint not on Basic; Kafka transactions and Kafka Streams in public preview (Premium/Dedicated); gzip-only compression.
- Kinesis: provisioned shard $0.0175/h Mumbai ($0.015 us-east-1); on-demand Standard writes $0.1023/GB Mumbai ($0.08); on-demand default max 200 MB/s write outside us-east-1/us-west-2/eu-west-1; retention 24 h–365 days; no built-in cross-region replication.
- Diskless: Confluent acquired WarpStream (9 Sep 2024); AutoMQ; Aiven Inkless GA (26 Feb 2026); KIP-1150 accepted, not shipped. CoreWeave acquired Bufstream (8 May 2026).
- Map positions are a qualitative summary.
