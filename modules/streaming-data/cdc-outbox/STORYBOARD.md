# Change data capture and the outbox (Streaming Data Systems, module 8)

1. **The ledger and the text message** (analogy): writing the sale and texting the warehouse separately vs a note in the same ledger entry passed on by a clerk.
2. **Lose an event** ⭐ (simulation): save-then-publish, publish-then-save, outbox + CDC × failures (Kafka down, crash, connector restart); database rows and topic events; duplicates deduped by id.
3. **Inside a change event** ⭐ (explore): Debezium envelope for insert/update/delete; op values; ts_ms vs source.ts_ms lag; snapshots and incremental snapshots.
4. **Reading each database's log** (explore): MySQL, PostgreSQL (replication slot trap), SQL Server, Oracle, MongoDB; Debezium, AWS DMS, Datastream, Azure, Flink CDC; Razorpay case study.
5. **Consistent or not?** (sort checkpoint).
6. **Wrap**.
