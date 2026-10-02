# Errors, retries and dead-letter queues (Streaming Data Systems, module 18)

1. **A breakdown at the toll booth** (analogy): wait for ever, abandon it, or retry then tow to a side lane.
2. **One bad event** ⭐ (fix the problem): payment #4 fails (permanent or transient); strategies retry-forever, log-and-skip, retry 3× then DLQ, retry topics then DLQ; partition tiles, processed count, DLQ contents, verdict.
3. **Back off, with jitter** ⭐ (simulation): 12 consumers' retry times, exponential backoff vs full jitter.
4. **Dead letters everywhere** (explore): Kafka Connect, Kafka Streams, Spring, AWS, Google/Azure, Flink; monitoring and replay.
5. **Retry, park or replay?** (sort checkpoint).
6. **Wrap**.
