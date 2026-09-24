# Storyboard: Inside a Parquet file

Track: Modern Data Lakehouse · Chapter 1 · Module 4 · ~30 min · Core · First 3D module

## 1. What must the learner truly understand?

1. **A Parquet file is organised for skipping.** File → row groups → column chunks → pages, with a footer at the end describing where everything is and what's inside (schema, min/max).
2. **Readers start at the end.** Read the footer, decide which row groups and columns are needed, then fetch only those bytes. That is predicate pushdown (skip rows by statistics) and projection pruning (skip columns).
3. **Statistics only help when data is organised.** Min/max skipping works when data is sorted or clustered on the filtered column (or naturally ordered, like timestamps).
4. **Encodings and compression stack:** encoding (dictionary, run-length, delta) first, then a codec (Snappy, ZSTD, GZIP…) per page.

## 2. Misconceptions

| Misconception                          | Tackled in                                        |
| -------------------------------------- | ------------------------------------------------- |
| "A Parquet file is read front to back" | Step 1 reading order + order checkpoint           |
| "Statistics make every filter fast"    | Skipping simulation with a sorted/unsorted toggle |
| "Parquet has one default codec"        | Codec step: defaults differ by writer             |
| "Nested data can't be columnar"        | Deep dive: repetition and definition levels       |

## 3. Steps

| #   | Step                              | Interaction                                                                                                  | Gate   |
| --- | --------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------ |
| 1   | A book with the index at the back | Analogy + animated reading order (tail → footer → only needed chunks)                                        |        |
| 2   | Zoom into a Parquet file ⭐       | Scroll story over a persistent 3D scene: file → row groups → column chunks → pages → encoded values → footer |        |
| 3   | Skip what you don't need          | Filter slider + column picker over 8 row groups; sorted vs unsorted; bytes read                              |        |
| 4   | Checkpoint                        | Why did sorting make skipping possible?                                                                      | choice |
| 5   | The right encoding per column     | Pick a column; see dictionary, run-length or delta encoding applied                                          |        |
| 6   | Codecs: speed vs size             | Qualitative trade-off map + who defaults to what                                                             |        |
| 7   | Deep dive: nested data            | Repetition and definition levels for a list of items                                                         |        |
| 8   | Checkpoint                        | Order the steps of reading a Parquet file                                                                    | order  |
| 9   | Takeaways                         | Tuning knobs and what to remember                                                                            |        |
