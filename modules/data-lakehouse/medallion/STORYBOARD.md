# Storyboard: Medallion architecture

Track: Modern Data Lakehouse · Chapter 6 · Module 20 · ~30 min · level: core

## What must the learner understand?

1. Bronze keeps what arrived, silver makes it correct, gold shapes it for a use; each layer can be rebuilt from the one before.
2. Quality rules need a failure action: warn, drop, fail, or quarantine (a pattern).
3. Pipelines are DAGs: declare inputs, the tool decides order and parallelism.
4. Jobs must be idempotent (replace a period or MERGE on keys) so retries and backfills are safe, and backfills must flow downstream.

## Steps

| #   | Step                                | Interaction                                                                           | Gate   |
| --- | ----------------------------------- | ------------------------------------------------------------------------------------- | ------ |
| 1   | One messy record, bronze to gold ⭐ | **Scroll story** with a kitchen analogy; one order cleaned layer by layer             |        |
| 2   | Which layer?                        | Sort six jobs into bronze / silver / gold                                             | sort   |
| 3   | What happens to a bad record?       | Choose warn / drop / fail / quarantine per rule; see silver, quarantine, metrics, SQL |        |
| 4   | Wire the pipeline ⭐                | **Build-connect**: pick inputs per table, run in waves; dbt ref()/source() code       |        |
| 5   | Replay a bad day ⭐                 | **Fix the problem**: append vs overwrite vs MERGE × runs × rebuild gold               |        |
| 6   | The retry                           | Atomic ≠ idempotent                                                                   | choice |
| 7   | The toolbox                         | Transform / orchestrate / check quality                                               |        |
| 8   | What to remember                    |                                                                                       |        |
