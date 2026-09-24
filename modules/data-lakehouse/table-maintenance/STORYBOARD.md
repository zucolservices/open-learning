# Storyboard: Keeping tables healthy

Track: Modern Data Lakehouse · Chapter 4 · Module 15 (closes the chapter) · ~25 min · level: core

## What must the learner understand?

1. Tables accumulate three kinds of clutter: small files (slow reads), old versions (storage, kept for time travel) and orphan files (debris from failed writes).
2. Four routine jobs address them: compaction, removing old versions, removing orphans, tidying metadata. Compaction creates old versions, so clean-up must follow it.
3. Retention is a trade-off between storage cost and how far back time travel reaches; waiting periods are safety margins.
4. Managed platforms automate this; know the defaults and that clean-up deletes anything unreferenced.

## Steps

| #   | Step                   | Interaction                                                                                         | Gate   |
| --- | ---------------------- | --------------------------------------------------------------------------------------------------- | ------ |
| 1   | Why is my phone full?  | Visible vs real storage; each kind of clutter mapped to a lakehouse equivalent                      |        |
| 2   | Six months ⭐          | **Scroll story** driven by the model: small files, MERGE copies, orphans, the bill, then maintained |        |
| 3   | Set the policy ⭐      | **Simulator**: compaction, retention, orphan clean-up; storage and query-time curves over 6 months  |        |
| 4   | The four jobs          | Per-format commands and defaults                                                                    |        |
| 5   | The bill that tripled  | Fix the problem                                                                                     | choice |
| 6   | How far back?          | Retention vs time travel                                                                            | choice |
| 7   | Let the platform do it | Predictive optimization, S3 Tables, Glue optimizers, BigQuery                                       |        |
| 8   | Takeaways              |                                                                                                     |        |
