# Sources: Background jobs and queues (fact-checked 2026-10-12)

- Marc Brooker, "Exponential Backoff And Jitter", AWS Architecture Blog, 4 Mar 2015 (full jitter best).
- AWS SQS docs (visibility timeout 30 s default; DLQ redrive; max message 1 MiB since 4 Aug 2025). RabbitMQ 4 (quorum queues). Sidekiq 8; Celery 5.6; BullMQ 6 (Redis or PostgreSQL, Jul 2026); Hangfire; Spring Batch 6; Rails 8 Solid Queue; Temporal.

The café order flow and timings are made up/illustrative. Notes: scratchpad `sd/backend/m14-facts.md`.
