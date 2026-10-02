# Delivery guarantees (Streaming Data Systems, module 10)

1. **Couriers and signatures** (analogy): leave at door / redeliver until signed / numbered parcels with a register.
2. **Crash at the worst moment** ⭐ (simulation): failure (write lost, ack lost, producer restart, consumer crash) × producer (fire and forget, retries, idempotent, transactional) × consumer (commit before, after, transactional read_committed) + SMS side effect + dedupe by event ID; counts lost / duplicated; explanation.
3. **How Kafka does exactly once** (step-through): PID + sequence numbers; transactional.id fencing; offsets in the transaction; markers and read_committed; exactly_once_v2; Jepsen KAFKA-17754 and KIP-890; 3% overhead.
4. **Guarantees elsewhere** (explore): Kinesis, Pub/Sub, Event Hubs, SQS FIFO, Pulsar.
5. **Which guarantee?** (sort checkpoint).
6. **Wrap**.
