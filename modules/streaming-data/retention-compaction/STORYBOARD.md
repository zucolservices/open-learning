# Retention, compaction and tiered storage (Streaming Data Systems, module 6)

1. **A phone that never fills up** (analogy): disappearing chats, storage limit, contacts list, photo backup → time, size, compaction, tiering.
2. **Delete, or keep the latest** ⭐ (simulation, scaled down): price updates keyed by product in 3-day segments; day slider under time / size / compact / compact+time; whole segments deleted, compaction keeps the latest per key, milk's tombstone appears then goes; offsets keep their gaps.
3. **Old segments to object storage** ⭐ (calculator): TB kept and days on broker disks → all-local (3 × gp3) vs tiered (S3) monthly cost, Mumbai prices; MSK tiered price; Kafka 3.9 tiered storage; diskless (KIP-1150) status.
4. **How long others keep events** (explore): Kinesis, Pub/Sub, Event Hubs (+Capture), Kafka forever (New York Times).
5. **Which policy?** (sort checkpoint).
6. **Wrap**.
