# Sources (fact-checked 2026-09)

- M. Brooker, "Exponential Backoff And Jitter", AWS Architecture Blog, 4 Mar 2015: full jitter = random(0, min(cap, base·2^n)); equal jitter; decorrelated jitter. Full jitter does much less work than no jitter; decorrelated finishes slightly sooner.
- Amazon Builders' Library, "Timeouts, retries, and backoff with jitter": 5 layers × 3 tries = 243× load on the database; retry at a single point in the stack; SDK token-bucket retry limits (since 2016).
- AWS SDKs and Tools reference, retry behavior: standard mode, 3 max attempts, retry quota 500 tokens; revised behaviour announced May 2026, default from November 2026.
- Google SRE book, "Handling Overload": at most 3 attempts per request; per-client retry budget keeps retries under 10% of requests.
- Envoy RetryPolicy.RetryBudget: budget_percent defaults to 20%, min_retry_concurrency 3.
- gRPC proposal A6 (client retries): retry or hedging policy per method, maxAttempts capped at 5, retry throttling token bucket.
- Stripe API docs, idempotent requests: Idempotency-Key header; first result (including 500 errors) saved and replayed; keys may be pruned after at least 24 hours; mismatched parameters rejected; POST only.
- RFC 9110 §9.2.2: PUT, DELETE and safe methods are idempotent; POST is not (PATCH, RFC 5789, is not either).
- Apache Kafka KIP-679: idempotent producer enabled by default from 3.0 (effective in 3.0.1 / 3.1.1 / 3.2.0 after KAFKA-13598). SQS FIFO deduplication; Pub/Sub exactly-once delivery (pull, same region).
- N. Bronson et al., "Metastable Failures in Distributed Systems", HotOS 2021 (the term "metastable failure").
