# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `streaming/m19-facts.md` (raw pages in `m19/`).

- Jun Rao, "How to choose the number of topics/partitions in a Kafka cluster?", Confluent blog, 12 Mar 2015: "you need to have at least max(t/p, t/c) partitions". https://www.confluent.io/blog/how-choose-number-topics-partitions-kafka-cluster/
- Amazon MSK best practices: about 1,000 partitions (replicas included) per kafka.m7g.large broker; no published MB/s per Standard broker (use the sizing spreadsheet and load tests); Express broker quotas. MSK Serverless: 200 MBps in, 400 MBps out, 2,400 partitions per cluster.
- Kinesis Data Streams quotas: shard 1 MB/s or 1,000 records/s write, 2 MB/s read; on-demand mode. Event Hubs: throughput unit 1 MB/s or 1,000 events/s in, 2 MB/s or 4,096 events/s out; up to 40 TUs per Standard namespace. Pub/Sub: $40 per TiB, 1 KB minimum per request.
- List prices read 2 Oct 2026 (AWS Price List, Azure Retail Prices API, Google Cloud pricing pages): Kinesis shard-hour $0.015 / $0.0175 (Mumbai), PUT payload units $0.014 / $0.0185 per million; on-demand $0.04 / $0.0517 stream-hour, $0.08 / $0.1023 per GB in, $0.04 / $0.0517 per GB out; Event Hubs Standard $0.03 per TU-hour, $0.028 per million events; MSK Serverless $0.75 / $0.79 cluster-hour, $0.0015 / $0.0016 partition-hour, $0.10 / $0.11 per GB in, $0.05 / $0.056 per GB out; EC2 m7g.large $0.0816 / $0.0583; EBS gp3 $0.08 / $0.0912 per GB-month; S3 Standard $0.023 per GB-month.
- AWS data transfer between AZs: $0.01/GB in each direction; MSK doesn't charge for replication traffic between brokers; Azure stopped charging for inter-zone transfer in 2024.
- KIP-392 fetch from closest replica (Kafka 2.4); AWS Big Data Blog (23 Aug 2022): up to "two-thirds" of consumer cross-AZ charges saved. KIP-1150 diskless topics accepted, not shipped as of Kafka 4.3.1.
- UPI: 24.07 billion transactions in September 2026 (press reports citing NPCI, 1 Oct 2026); about 9,300 per second on average (derived; NPCI publishes no peak TPS).
- All monthly totals in the module are our own arithmetic on these list prices with stated assumptions (illustrative).
