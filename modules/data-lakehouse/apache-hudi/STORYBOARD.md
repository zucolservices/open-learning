# Storyboard: Apache Hudi, the timeline

Track: Modern Data Lakehouse · Chapter 2 · Module 8 · ~30 min

## 1. What must the learner truly understand?

1. **Hudi was built for tables whose rows keep changing.** Upserts (update-or-insert by key) and incremental reads (just what changed) are its two founding ideas.
2. **The timeline is the table's source of truth.** Every action is an instant that moves requested → inflight → completed; readers only trust completed instants.
3. **Every record has a key, and an index maps each key to a file group.** That's how an update finds the one file group it must touch instead of rewriting a partition.
4. **Copy-on-Write rewrites the file on update; Merge-on-Read appends a log and merges later.** It's a trade between write cost and read cost, and compaction moves the balance back.

## 2. What makes it hard? (misconceptions to tackle)

| Misconception                                                  | Where we tackle it                                                         |
| -------------------------------------------------------------- | -------------------------------------------------------------------------- |
| "An update edits the row inside the Parquet file"              | Simulation (step 5): CoW writes a new base file, MoR writes a log file     |
| "Hudi is only for streaming" / "Hudi is a streaming engine"    | Opening story + wrap: it's a table format with services, used by batch too |
| "The timeline is just a history log, like a changelog of rows" | Timeline step (2): it records actions and their states, not rows           |
| "Merge-on-Read is always better because writes are cheap"      | Query types (step 6) + sort checkpoint (11): readers pay until compaction  |
| "A read-optimized query returns the latest data"               | Query types (step 6) + checkpoint (7)                                      |
| "Finding which file holds a key means scanning everything"     | Record keys (3) and indexes (10)                                           |
| "Incremental = time travel"                                    | Incremental step (8): changes between instants vs a whole old version      |

## 3. Representation

- One table: `trips`, keyed by `trip_id`, one partition (`city=blr`) with three file groups (A, B, C) of three trips each. Nine rows, so every value is visible.
- **Semantic colours:** base files = `viz-data`; log files / changes = `viz-add`; timeline instants = `viz-meta`; writers and query reads = `viz-compute`; cleaned/removed = `viz-remove`.
- Timeline is always a horizontal rail of instants, newest on the right, with state shown by fill: hollow = requested, striped/pulsing = inflight, solid = completed.

## 4. What does the learner do?

| #   | Step                   | Interaction                                                                                                                       | Gate   |
| --- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1   | Why Uber built Hudi ⭐ | **Scroll story**: trips that keep changing → rewrite whole partitions → data a day late → upserts + incrementals                  |        |
| 2   | The timeline           | Kitchen order-rail analogy; step through writes that complete, and one that crashes and is rolled back                            |        |
| 3   | Keys and file groups   | Step-through: a batch of updates + an insert routed by the index to file groups                                                   |        |
| 4   | Checkpoint             | How does an update find its file?                                                                                                 | choice |
| 5   | Stream upserts ⭐      | **Simulation**: toggle CoW / MoR, send upsert batches, compact, clean; watch timeline, file slices, bytes written, files per read |        |
| 6   | Three ways to read     | Snapshot vs read-optimized vs incremental on the same MoR table; toggle compaction                                                |        |
| 7   | Checkpoint             | Read-optimized query before compaction: which fare?                                                                               | choice |
| 8   | Incremental pipelines  | Run a downstream job repeatedly; it pulls only changes since its last checkpoint                                                  |        |
| 9   | Table services         | Cleaning, compaction, clustering, archiving; inline vs async                                                                      |        |
| 10  | Indexes                | Compare Bloom, Simple, Bucket and Record-level index lookups                                                                      |        |
| 11  | Checkpoint             | Sort workloads into Copy-on-Write vs Merge-on-Read                                                                                | sort   |
| 12  | Concurrency & metadata | Single writer + async services, OCC with locks, non-blocking CC; the metadata table                                               |        |
| 13  | Takeaways              | Delta vs Iceberg vs Hudi at a glance + where Hudi runs                                                                            |        |

## 5. How will we know it landed? (checkpoints)

- Step 4: the index maps the record key to the file group that holds it.
- Step 7: read-optimized reads only base files, so it returns the fare as of the last compaction.
- Step 11: read-heavy / rarely updated → CoW; frequent updates with freshness needs → MoR.

## The dataset

`trips(trip_id, rider, fare, status)`, partition `city=blr`.

| File group | Trips               |
| ---------- | ------------------- |
| A          | t-101, t-102, t-103 |
| B          | t-104, t-105, t-106 |
| C          | t-107, t-108, t-109 |

Upsert batches in the simulation each change two trips in two different file groups.
