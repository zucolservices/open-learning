# Sources (fact-checked 2026-09)

- Two-phase commit: J. Gray, "Notes on Data Base Operating Systems" (1978); X/Open XA (1991).
- PostgreSQL PREPARE TRANSACTION docs: `max_prepared_transactions` defaults to 0; prepared transactions keep locks; "not intended for use in applications".
- Sagas: H. Garcia-Molina & K. Salem, "Sagas", SIGMOD 1987. microservices.io Saga pattern (choreography vs orchestration; compensable, pivot, retryable steps; countermeasures).
- Transactional outbox and idempotent consumer: microservices.io patterns (relay may publish more than once; PROCESSED_MESSAGES keyed by subscriber and message ID, updated in the same transaction).
- Dual writes: G. Morling, "Reliable Microservices Data Exchange With the Outbox Pattern" (Debezium blog, 2019); Debezium Outbox Event Router docs (id, aggregatetype, aggregateid, type, payload; routes to `outbox.event.<aggregatetype>`).
- AWS Step Functions docs: Standard = exactly-once step execution, up to 1 year; Express = at-least-once, up to 5 minutes.
- Temporal docs ("Durable Execution"); Azure Durable Functions docs (Durable Task Scheduler); Google Cloud Workflows docs (waits up to a year); Camunda 8.6 licensing for self-managed production.
- Spanner and CockroachDB docs: distributed transactions use 2PC over Paxos/Raft-replicated participants.
