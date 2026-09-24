# Storyboard: Delta Lake, the transaction log

Track: Modern Data Lakehouse · Chapter 2 · Module 6 · ~35 min

## 1. What must the learner truly understand?

1. **A Delta table is a folder of immutable Parquet files plus an ordered log of commits (`_delta_log/`).** The log, not the folder listing, decides which files make up the table.
2. **Any version of the table can be rebuilt by replaying the log.** That single idea explains time travel, RESTORE, audit history, checkpoints and why VACUUM matters.
3. **A commit is atomic because exactly one writer can create the next log file.** Concurrent writers use optimistic concurrency: they retry when there's no conflict and fail when there is one.

## 2. What makes it hard? (misconceptions to tackle)

| Misconception                                                          | Where we tackle it                                                                      |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| "The table is whatever Parquet files are in the folder"                | Explorer + checkpoint question (step 3–4): the folder holds removed files too           |
| "UPDATE edits rows in place"                                           | Commit anatomy (step 3): UPDATE = `remove` old file + `add` rewritten file              |
| "DELETE frees storage" / "old versions are copies"                     | Time travel (step 5) + predict (step 6): storage keeps growing; versions share files    |
| "Time travel is a backup that lasts forever"                           | VACUUM simulation (step 11): retention decides which versions survive                   |
| "Reading a big table means replaying thousands of JSON files"          | Checkpoint simulation (step 8)                                                          |
| "Two writers at once corrupt the table" / "any concurrent write fails" | Concurrency step-through (step 9–10): appends retry and succeed, conflicts fail cleanly |

## 3. Representation

- One small, concrete table (`orders`, 6 rows) followed through the whole module, so every abstraction points back to real rows.
- **Semantic colours:** files = `viz-data`, log/commits = `viz-meta`, writers/engines = `viz-compute`, added = `viz-add`, removed = `viz-remove`.
- File states are consistent everywhere: _in the table_ (solid), _added now_ (green), _removed now_ (red, dashed), _in storage only_ (ghost), _vacuumed_ (gone).

## 4. What does the learner do?

| #   | Step                 | Interaction                                                                                                 | Gate              |
| --- | -------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------- |
| 1   | The incident         | Read the story: a bad UPDATE zeroed every amount. Can we get the data back?                                 |                   |
| 2   | A table on disk      | File explorer: click log files and Parquet files, and see what each holds                                   |                   |
| 3   | Anatomy of a commit  | Annotated JSON of an UPDATE commit; click each action to see what it means                                  |                   |
| 4   | Checkpoint           | "Which files does a reader use for the current table?"                                                      | choice            |
| 5   | Replay the log ⭐    | **Version slider**: log, storage and table rows update together; replay animation                           |                   |
| 6   | Predict              | Files in storage after v5 (the table uses 1)                                                                | predict           |
| 7   | Fix the incident     | DESCRIBE HISTORY → pick the version to RESTORE; see a new commit re-add old files                           | choice-like (fix) |
| 8   | Checkpoints          | Slider for number of commits; files a reader must open, with and without checkpoints                        |                   |
| 9   | Two writers, one log | Step-through of optimistic concurrency; toggle "append + append" vs "conflicting update"                    |                   |
| 10  | Checkpoint           | Order the steps of a Delta write                                                                            | order             |
| 11  | VACUUM & retention   | Retention slider + run VACUUM; watch which versions stay readable                                           |                   |
| 12  | Checkpoint           | What happens to time travel after VACUUM with 7-day retention                                               | choice            |
| 13  | Modern Delta         | Deletion vectors (bytes rewritten: CoW vs DV), change data feed, liquid clustering, table features, UniForm |                   |
| 14  | Takeaways            | Summary + where Delta appears (Spark, delta-rs, DuckDB, Trino, Fabric…)                                     |                   |

## 5. How will we know it landed? (checkpoints)

- Step 4: the reader uses the log, not the folder listing.
- Step 6: storage holds 8 files while the table uses 1, so versions share and retain files.
- Step 7: restore to v3, the last good version. Picking v4 (the bad update) or v5 (OPTIMIZE of bad data) teaches why.
- Step 10: the write sequence is data files → actions → atomic put of next version → readers see it.
- Step 12: versions whose files were vacuumed can no longer be read.

## The dataset

`orders(order_id, customer, amount, status)`. Six commits:

| v   | Operation                     | Actions                                    |
| --- | ----------------------------- | ------------------------------------------ |
| 0   | CREATE TABLE + WRITE          | add f1, f2                                 |
| 1   | WRITE (append)                | add f3                                     |
| 2   | UPDATE status (1003)          | remove f2, add f4                          |
| 3   | DELETE (1002)                 | remove f1, add f5                          |
| 4   | UPDATE amount = 0 (no WHERE!) | remove f3, f4, f5, add f6, f7              |
| 5   | OPTIMIZE                      | remove f6, f7, add f8 (dataChange = false) |
| 6   | RESTORE to v3 (learner)       | remove f8, add f3, f4, f5                  |
