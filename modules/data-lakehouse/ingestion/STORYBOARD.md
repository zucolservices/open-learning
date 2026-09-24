# Storyboard: Getting data in

Track: Modern Data Lakehouse · Chapter 6 · Module 18 · ~30 min · level: core

## What must the learner understand?

1. Data arrives by batch, micro-batch or continuous processing; for a lakehouse table, the commit interval decides freshness.
2. Shorter intervals mean more, smaller files: freshness costs compaction.
3. Exactly-once is at-least-once plus de-duplication: replayable sources, checkpoints and idempotent commits, with sharp edges (deleted checkpoints).
4. Tools range from engines you run to managed services with different guarantees.

## Steps

| #   | Step                       | Interaction                                                                                    | Gate   |
| --- | -------------------------- | ---------------------------------------------------------------------------------------------- | ------ |
| 1   | One event's journey ⭐     | **Scroll story**: phone → API → Kafka → micro-batch → files → commit → query                   |        |
| 2   | Three ways to deliver      | Batch / micro-batch / continuous with analogies                                                |        |
| 3   | Tune a streaming writer ⭐ | **Simulator**: trigger interval × event rate → freshness, files, file size (assumptions shown) |        |
| 4   | Checkpoint                 | Pick a trigger for a 5-minute SLA                                                              | choice |
| 5   | Exactly once               | Crash mid-batch: plain append duplicates vs checkpoint + idempotent commit                     |        |
| 6   | Checkpoint                 | Deleted checkpoint + reused txnAppId silently drops data                                       | choice |
| 7   | The toolbox                | Engines you run vs managed services, with guarantees                                           |        |
| 8   | Takeaways                  |                                                                                                |        |
