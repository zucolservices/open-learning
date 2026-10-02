# Durability and replication (Streaming Data Systems, module 5)

1. **A register and two clerks** (analogy): head clerk writes, clerk 2 copies, clerk 3 behind; when to say "it's recorded".
2. **Lose a broker** ⭐ (simulation): B1 leader, B2/B3 followers; acks 0/1/all, min.insync 1/2, follower health, unclean election; write m5, crash the leader → safe / acknowledged write lost / offline / refused.
3. **Lessons learned the hard way** (step-through): Jepsen Kafka 2013, the fixes, unclean off by default (0.11), Redpanda 2022, Kafka 4.1 ELR, NATS 2025.
4. **How others keep copies** (explore): KRaft, MSK, Redpanda, Pulsar/BookKeeper, Kinesis, Pub/Sub, Event Hubs.
5. **Safe, lost or offline?** (sort checkpoint).
6. **Wrap**.
