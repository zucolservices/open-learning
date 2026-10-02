# Windows (Streaming Data Systems, module 13)

1. **Counting at a toll plaza** (analogy): four questions → tumbling, hopping, sliding, session.
2. **One clickstream, four windows** ⭐ (simulation): three users' clicks over an hour; tumbling 10m, hopping 10m/5m, Kafka Streams sliding 10m, session 5m gap; windows drawn with counts; no empty windows.
3. **Late data and when to emit** ⭐ (step-through, Kafka Streams rules): window 10:00–10:10, a 10:07 straggler at 10:14; grace none / 5 min × emit every update / on close; results sent downstream.
4. **Same windows, different names** (explore): terminology table across Flink, Flink SQL, Kafka Streams, Spark, Beam, ksqlDB; CUMULATE; grace defaults.
5. **Which window?** (sort checkpoint).
6. **Wrap**.
