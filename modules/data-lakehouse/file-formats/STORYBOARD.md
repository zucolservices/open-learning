# Storyboard: Rows vs columns, file formats

Track: Modern Data Lakehouse · Chapter 1 · Module 3 · ~20 min · Beginner

## 1. What must the learner truly understand?

1. **A file is one long line of bytes.** Saving a table means flattening it, either row by row or column by column. That choice decides how much a query must read.
2. **Formats differ in four ways that matter:** row vs column, schema/types (and whether the file describes itself), splittability (can many workers read one file in parallel?), and compression.
3. **Each format has a home:** CSV for hand-offs, JSON for APIs and events, Avro for streaming messages and row-at-a-time exchange, Parquet/ORC for analytics. Lakehouse tables store their data as Parquet, and use JSON and Avro for metadata.

## 2. Misconceptions

| Misconception                                         | Tackled in                                                                  |
| ----------------------------------------------------- | --------------------------------------------------------------------------- |
| "A file just stores the table" (no flattening choice) | Step 1: animate a 2D table into a 1D strip, two ways                        |
| "CSV is fine for analytics"                           | Scroll story + query simulation: no types, reads everything                 |
| "Compression is the same whatever the layout"         | Step 4: why columns compress better (dictionary, run-length)                |
| "Any compressed file can be processed in parallel"    | Step 6: .csv.gz leaves 7 of 8 workers idle                                  |
| "Parquet replaces every other format"                 | Sort checkpoint + wrap-up: each format has a job; table formats use several |

## 3. Steps

| #   | Step                           | Interaction                                                                                                                      | Gate   |
| --- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1   | Flattening a table             | Toggle row/column flattening of a small table into a byte strip                                                                  |        |
| 2   | The journey of order #88213 ⭐ | Scroll story: JSON in the app → CSV for finance → Avro on Kafka → Parquet in the lake, with each format's real text or structure |        |
| 3   | What a query reads             | Choose a query; compare bytes read in row vs columnar layout                                                                     |        |
| 4   | Why columns compress better    | Step through dictionary then run-length encoding of a column                                                                     |        |
| 5   | Which format fits?             | Sort six situations into CSV / JSON / Avro / Parquet                                                                             | sort   |
| 6   | Many workers, one file         | Pick a format; watch 8 workers split (or fail to split) a big file                                                               |        |
| 7   | Checkpoint                     | Why is Spark slow on one big .csv.gz?                                                                                            | choice |
| 8   | The cheat sheet                | Interactive comparison matrix                                                                                                    |        |
| 9   | Takeaways                      | Formats inside Delta, Iceberg and Hudi; Arrow in memory                                                                          |        |
