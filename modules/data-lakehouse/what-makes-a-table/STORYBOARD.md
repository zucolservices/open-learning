# Storyboard: What makes a table a table

Track: Modern Data Lakehouse · Chapter 2 · Module 5 · ~25 min · Beginner

## 1. What must the learner truly understand?

1. **A "table" is a promise**: a name, a schema, and an agreed, consistent set of rows at any moment. A folder of files keeps only the first part of that promise.
2. **Hive-style tables = metastore + directory.** The metastore knows the name, schema and location; "the data" is whatever files happen to be in the directory when you list it.
3. **Without an atomic record of which files belong, things break:** readers see half-written data, crashed jobs leave junk, overwrites race with readers, schemas drift, listing is slow, and there's no history.
4. **A table format adds that record** (a log or metadata tree + snapshots), and the fixes follow from it: atomic commits, isolation, schema enforcement, statistics, time travel.

## 2. Misconceptions

| Misconception                               | Tackled in                                                         |
| ------------------------------------------- | ------------------------------------------------------------------ |
| "The metastore stores the data"             | Step 2: metastore holds metadata; files live in the directory      |
| "If every job is careful, a folder is fine" | Step 3: three incidents that happen even when every job is correct |
| "The _SUCCESS file protects readers"        | Incident 1 notes: readers don't check it                           |
| "Table formats replace Parquet"             | Step 6: the same Parquet files, plus a metadata layer              |

## 3. Steps

| #   | Step                     | Interaction                                                                                                                                     | Gate   |
| --- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1   | A folder isn't a table   | "What does an engine need to answer SELECT * FROM orders?" — reveal the four answers                                                            |        |
| 2   | How Hive tables work     | Step-through: metastore → list directory → read every file found                                                                                |        |
| 3   | Three incidents ⭐       | Fix-the-problem: play each incident on a timeline (reader mid-write, crashed job, overwrite race), diagnose, then replay with a transaction log |        |
| 4   | Checkpoint               | The one thing that would have prevented all three                                                                                               | choice |
| 5   | Name the problem         | Sort six symptoms into atomicity / isolation / schema / performance                                                                             | sort   |
| 6   | What a table format adds | Click each problem to see the mechanism that fixes it                                                                                           |        |
| 7   | Three answers            | Delta (log), Iceberg (metadata tree), Hudi (timeline) preview                                                                                   |        |
| 8   | Takeaways                |                                                                                                                                                 |        |
