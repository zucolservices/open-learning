# Storyboard: CDC, MERGE & slowly changing dimensions

Track: Modern Data Lakehouse · Chapter 6 · Module 19 · ~35 min · level: deep

## What must the learner understand?

1. CDC turns a database's log into change events (a bank statement, not a balance), and the log position is what orders them.
2. MERGE matches a batch against the table as it was before the batch; it needs one source row per key.
3. Late and repeated events need three defences: dedupe per batch, a "newer only" guard, and soft deletes (tombstones).
4. SCD Type 1 overwrites; Type 2 keeps dated versions for questions about the past.
5. Lakehouse tables emit their own change feeds for downstream pipelines.

## Steps

| #   | Step                            | Interaction                                                                        | Gate   |
| --- | ------------------------------- | ---------------------------------------------------------------------------------- | ------ |
| 1   | A row's life, told as events ⭐ | **Scroll story**: snapshot (r) → insert (c) → update (u) → delete (d) + tombstone → replay | |
| 2   | Anatomy of a change event       | Click fields of a Debezium / DMS / Datastream record                               |        |
| 3   | MERGE, clause by clause         | Step-through of one batch against a target table                                   |        |
| 4   | Checkpoint                      | Two events for a new customer without dedupe → two rows                            | choice |
| 5   | The replay lab ⭐               | **Fix the problem**: in-order vs late/repeated arrival × three fixes; live SQL     |        |
| 6   | Overwrite, or keep history?     | Step Priya's moves under Type 1 / Type 2; "which city on 20 April?"                |        |
| 7   | Checkpoint                      | Sort needs into Type 1 / Type 2                                                    | sort   |
| 8   | Change feeds                    | Same MERGE as Delta CDF / Iceberg changelog / Hudi CDC output                      |        |
| 9   | What to remember                |                                                                                    |        |
