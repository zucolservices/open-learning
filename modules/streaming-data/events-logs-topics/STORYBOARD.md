# Events, logs and topics (Streaming Data Systems, module 2)

1. **A passbook nobody can rewrite** (analogy): lines only added at the bottom; you, your accountant and the tax office each read at their own position.
2. **What's in an event** (explore): key, value, timestamp (CreateTime/LogAppendTime), headers; Kafka's own example.
3. **Write once, read many times** ⭐ (simulation): a producer appends payments; fraud check, ledger and SMS consumers each move their own offset; replay the ledger from yesterday 18:00; switch to a classic queue where messages are shared out and deleted.
4. **Same idea, different names** (explore): log, position, retention and replay on Kafka, Redpanda, Pulsar, Kinesis, Pub/Sub, Event Hubs; LinkedIn and PhonePe scale.
5. **Log or queue?** (sort checkpoint).
6. **Wrap**.
