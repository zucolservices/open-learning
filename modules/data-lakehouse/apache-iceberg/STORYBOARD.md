# Storyboard: Apache Iceberg, the metadata tree

Track: Modern Data Lakehouse · Chapter 2 · Module 7 · ~35 min

## 1. What must the learner truly understand?

1. **An Iceberg table is a tree of metadata over immutable data files.** The catalog points to the current metadata file, which leads to a manifest list, then manifests, then data files. Each level summarises the level below it.
2. **Reading means walking down the tree and skipping branches.** Partition ranges in the manifest list skip whole manifests; column stats in manifests skip individual files. Nothing is listed.
3. **Writing means building a new top of the tree and swapping one pointer.** Unchanged branches are reused. The catalog's atomic swap is the commit; if someone else moved the pointer first, the writer retries.
4. **Because every column has an ID and partitions are derived from columns, the table can change shape without rewriting data.** That covers hidden partitioning, partition evolution and schema evolution.

## 2. What makes it hard? (misconceptions to tackle)

| Misconception                                                   | Where we tackle it                                                              |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| "Iceberg is a database/server" / "Iceberg is a file format"     | Opening (step 1): it's a spec for metadata files that sit next to Parquet files |
| "Five levels of metadata must make reads slower"                | Follow a query (step 3): each level lets the engine skip work                   |
| "The catalog stores the table"                                  | Tree story (step 2) + commit (step 5): the catalog stores one pointer           |
| "Every commit rewrites all the metadata"                        | Commit step-through (step 5) + checkpoint (step 6): unchanged manifests reused  |
| "To prune by date you must filter on a separate date column"    | Hidden partitioning (step 8)                                                    |
| "Changing partitioning means rewriting the table"               | Partition evolution (step 9)                                                    |
| "Renaming a column is just a label change, so it's always safe" | Field IDs (step 10): by-name matching breaks on rename and on drop-then-add     |
| "Deletes rewrite files" / "all deletes are the same"            | Row-level deletes (step 12): CoW vs position vs equality vs deletion vectors    |

## 3. Representation

- Same Brewline `orders` table as the Delta module, now as an Iceberg table partitioned by `day(order_ts)`: 3 days, 3 manifests, 9 data files. Small enough to see every node.
- **Semantic colours:** catalog = `accent`; metadata levels = `viz-meta`; data files = `viz-data`; files a query reads = `viz-compute`; new nodes = `viz-add`; skipped = `viz-idle` (faded).
- The 3D tree is vertical (top = catalog) so "walking down" is literal. The camera follows.

## 4. What does the learner do?

| #   | Step                       | Interaction                                                                                       | Gate   |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------- | ------ |
| 1   | A diary or a tree?         | Toggle Delta vs Iceberg; library analogy (front-desk card → guide → section list → shelf lists)   |        |
| 2   | The tree in 3D ⭐          | **Persistent 3D scroll story**: catalog → metadata file → manifest list → manifests → data files  |        |
| 3   | Follow a query ⭐          | Pick one of 3 queries; step down the 3D tree and watch manifests, then files, get skipped         |        |
| 4   | Checkpoint                 | Order the read path                                                                               | order  |
| 5   | A commit = a new top       | Step-through: data file → manifest → manifest list → metadata file → pointer swap; toggle a race  |        |
| 6   | Checkpoint                 | 500 manifests, append one file: how many manifests are written?                                   | choice |
| 7   | Snapshots, branches & tags | Pick a snapshot to time-travel; step through write-audit-publish on a branch                      |        |
| 8   | Hidden partitioning        | Choose a transform, see partition values derived live; compare Hive vs Iceberg for the same query |        |
| 9   | Partition evolution        | Switch month → day mid-history; see old and new files coexist and a query plan across both specs  |        |
| 10  | Field IDs                  | Rename / drop / re-add columns; toggle by-name vs by-ID and read an old file                      |        |
| 11  | Checkpoint                 | Sort changes into "metadata only" vs "rewrites data files"                                        | sort   |
| 12  | Row-level deletes          | One DELETE, four strategies: copy-on-write, position delete, equality delete, v3 deletion vector  |        |
| 13  | Checkpoint                 | Streaming job deletes by key without reading files: which delete?                                 | choice |
| 14  | Keeping it healthy         | Maintenance procedures + where Iceberg runs (catalogs, engines, clouds)                           |        |
| 15  | Takeaways                  | Delta vs Iceberg side by side + summary                                                           |        |

## 5. How will we know it landed? (checkpoints)

- Step 4: catalog → metadata file → manifest list → manifests → data files.
- Step 6: one new manifest (plus one new manifest list and one metadata file); the 500 are reused.
- Step 11: rename/add/widen/partition change = metadata only; compaction and re-partitioning old data = rewrite.
- Step 13: equality deletes (write by key, no read; readers pay later).

## The dataset

`orders(order_id, customer_id, order_ts, amount, status)`, partitioned by `day(order_ts)`.

| Manifest | Day        | Files: amount min–max              |
| -------- | ---------- | ---------------------------------- |
| m1       | 2026-09-22 | f1 20–180 · f2 90–350 · f3 150–420 |
| m2       | 2026-09-23 | f4 30–240 · f5 60–310 · f6 110–395 |
| m3       | 2026-09-24 | f7 40–260 · f8 210–520 · f9 80–330 |

Queries in step 3:

- `order_ts on Sep 24 AND amount > 400` → 1 of 3 manifests, 1 of 9 files (f8).
- `amount > 400` → manifests can't be skipped (not a partition column), files f3 and f8 read: 2 of 9.
- `SUM(amount)`, no filter → everything: 9 of 9.
