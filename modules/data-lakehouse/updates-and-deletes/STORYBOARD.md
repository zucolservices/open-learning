# Storyboard: Updates & deletes, Copy-on-Write vs Merge-on-Read

Track: Modern Data Lakehouse · Chapter 3 · Module 11 · ~30 min · level: deep

Earlier modules showed each format's mechanism (Delta deletion vectors, Iceberg delete files, Hudi CoW/MoR tables, the side-by-side showdown). This module is about **costs**: when each strategy wins, and how compaction moves the balance.

## 1. What must the learner truly understand?

1. **Every update is a delete plus an insert, and finding the rows costs the same either way.** The strategies differ only in how the "delete" half is recorded.
2. **Copy-on-Write pays at write time (write amplification); Merge-on-Read pays at read time (read amplification) until compaction.** Which is cheaper depends on the ratio of updates to reads and how updates spread across files.
3. **Compaction turns read debt back into clean files.** Its schedule is a tuning knob with a sweet spot, and it's also what physically removes deleted rows (with vacuum/expiry), which matters for privacy deletes.

## 2. What makes it hard? (misconceptions to tackle)

| Misconception                                      | Where we tackle it                                          |
| -------------------------------------------------- | ----------------------------------------------------------- |
| "Updating one row writes one row"                  | Anatomy (2) + write-amplification predict (5)               |
| "Merge-on-Read is always better; it's newer"       | Simulator (4): read-heavy workloads flip the answer         |
| "All Merge-on-Read variants cost readers the same" | MoR family (3): DVs vs position vs equality deletes vs logs |
| "Compact as often as possible" / "never compact"   | Compaction sawtooth (6)                                     |
| "DELETE removes the data" (privacy)                | Physically gone? (7)                                        |

## 3. Representation

- Table `orders`: 100 files × 128 MB, ~1 million rows each. Updates arrive in batches every 5 minutes.
- Colours: write cost `viz-meta`, read cost `viz-compute`, pending changes `viz-add`, removed `viz-remove`.
- Model assumptions are always shown next to the numbers; results are labelled illustrative.

## 4. What does the learner do?

| #   | Step                     | Interaction                                                                                       | Gate    |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------- | ------- |
| 1   | A typo in a printed book | Reprint the page vs an errata slip; watch errata pile up and readers slow down                    |         |
| 2   | Anatomy of an UPDATE     | Step-through: find → change (CoW rewrite / MoR mark + insert) → commit                            |         |
| 3   | The Merge-on-Read family | Compare DVs, position deletes, equality deletes, log files: what the reader must do               |         |
| 4   | The trade-off ⭐         | **Simulator**: sliders for update rate, read rate, spread, compaction interval; bars trade places |         |
| 5   | Checkpoint               | Predict MB written by CoW for a small update                                                      | predict |
| 6   | When to compact          | Sawtooth chart of read cost over a day; move the compaction interval                              |         |
| 7   | Is it really gone?       | Step-through of a privacy delete: marked → rewritten → old files removed                          |         |
| 8   | Checkpoint               | Order the steps to physically erase a customer                                                    | order   |
| 9   | Switching it on          | Settings per format                                                                               |         |
| 10  | Takeaways                |                                                                                                   |         |
