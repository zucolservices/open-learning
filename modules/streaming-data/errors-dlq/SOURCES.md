# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `streaming/m18-facts.md`.

- Confluent, "Spring for Apache Kafka: can your consumers handle a poison pill?": a poison pill is "a record that ... always fails when consumed, no matter how many times it is attempted"; the partition stalls because the consumer offset doesn't move. https://www.confluent.io/blog/spring-kafka-can-your-kafka-consumers-handle-a-poison-pill/
- Kafka Connect error handling (KIP-298, Kafka 2.0.0): errors.tolerance none/all, errors.retry.timeout (default 0), errors.retry.delay.max.ms (60000), errors.deadletterqueue.topic.name for sink connectors only, `__connect.errors.` context headers. https://cwiki.apache.org/confluence/display/KAFKA/KIP-298%3A+Error+Handling+in+Connect
- Kafka Streams: processing exception handler (KIP-1033, 3.9); handler config names lose the `default.` prefix in 4.0 (KIP-1056); deserialization default LogAndFailExceptionHandler; built-in dead-letter queue errors.dead.letter.queue.topic.name in 4.2 (KIP-1034). https://cwiki.apache.org/confluence/display/KAFKA/KIP-1034%3A+Dead+letter+queue+in+Kafka+Streams
- Spring for Apache Kafka: DefaultErrorHandler default FixedBackOff(0, 9), blocking; DeadLetterPublishingRecoverer; @RetryableTopic non-blocking retries with -retry and -dlt topics, "By using this strategy you lose Kafka's ordering guarantees for that topic." https://docs.spring.io/spring-kafka/reference/retrytopic/how-the-pattern-works.html
- Uber Engineering, Ning Xia, "Building Reliable Reprocessing and Dead Letter Queues with Apache Kafka" (16 Feb 2018): retry topics plus DLQ list/purge/merge. https://www.uber.com/blog/reliable-reprocessing/
- Amazon SQS dead-letter queues (maxReceiveCount) and redrive (console Dec 2021, SDK Jun 2023). https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html
- AWS Lambda event source mappings: BisectBatchOnFunctionError, MaximumRetryAttempts/MaximumRecordAgeInSeconds (default -1); on-failure destinations SQS, SNS, S3 (Nov 2024), Kafka topic; "a bad record can block processing on the affected shard for up to one week." https://docs.aws.amazon.com/lambda/latest/dg/kinesis-on-failure-destination.html
- Google Pub/Sub dead-letter topics (subscription property, 5–100 attempts, default 5) and per-message exponential backoff. https://cloud.google.com/pubsub/docs/handling-failures
- Azure: Event Hubs has no dead-lettering, Service Bus does (max delivery count default 10). https://learn.microsoft.com/en-us/azure/service-bus-messaging/compare-messaging-services
- Apache Flink: side outputs for bad records; Kafka source deserializer failures fail the job; json.ignore-parse-errors drops rows. https://nightlies.apache.org/flink/flink-docs-stable/docs/dev/datastream/side_output/
- Marc Brooker, "Exponential Backoff And Jitter", AWS Architecture Blog, 4 Mar 2015 (paraphrased). https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/
- The 12-event partition, the strategy outcomes and the 12-consumer retry timelines are illustrative.
