# Sources (fact-checked 2026-09)

- M. Nygard, *Release It!* (2007; 2nd ed. 2018): Circuit Breaker and Bulkheads stability patterns. M. Fowler, "CircuitBreaker" bliki (6 Mar 2014): closed / open / half-open.
- Netflix Hystrix README: maintenance mode, recommends resilience4j. Resilience4j 2.4.0 (2026); Polly 8.x.
- Envoy circuit_breaker.proto: max_connections, max_pending_requests, max_requests default 1024; max_retries 3; retry budget 20% / min 3.
- Amazon API Gateway throttling: token bucket; 10,000 rps and 5,000 burst per account per Region (2,500 / 1,250 in newer Regions); 429 responses.
- RFC 6585 §4 (429 Too Many Requests, optional Retry-After); draft-ietf-httpapi-ratelimit-headers (active Internet-Draft, 2026).
- Google SRE book, "Addressing Cascading Failures": deadlines and deadline propagation, load shedding (503 above in-flight limits), LIFO/CoDel queues. gRPC deadlines guide: no default deadline.
- Stripe engineering blog, "Scaling your API with rate limiters" (P. Tarjan, 2017): token bucket, load shedders.
