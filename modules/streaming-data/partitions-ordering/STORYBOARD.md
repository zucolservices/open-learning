# Partitions and ordering (Streaming Data Systems, module 3)

1. **Counters at the post office** (analogy): customers sent to counters by PIN code; one bulk mailer swamps a counter.
2. **From key to partition** ⭐ (real algorithm): type a key, see Kafka's murmur2 → toPositive → % partitions; switch 3/6/12 partitions and watch sample keys move; librdkafka CRC32 caveat.
3. **Order only within a partition** ⭐ (simulation): four orders' placed/paid/shipped events over three partitions read with different lags; no key and status key break order, order ID and customer ID keep it.
4. **One partition runs hot** ⭐ (simulation): MegaMart 40% of payments; key by merchant / payer / salted merchant over 6 or 12 partitions (real hash); adding partitions doesn't fix a hot key.
5. **Partitions everywhere** (explore): Kafka, MSK, Kinesis, Pub/Sub, Event Hubs, Pulsar; idempotent producer ordering.
6. **Pick the key** (sort checkpoint).
7. **Wrap**.
