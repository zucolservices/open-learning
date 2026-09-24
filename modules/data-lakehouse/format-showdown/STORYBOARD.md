# Storyboard: Delta vs Iceberg vs Hudi

Track: Modern Data Lakehouse · Chapter 2 · Module 9 (closes the chapter) · ~30 min

## 1. What must the learner truly understand?

1. **All three formats do the same basic job.** Immutable Parquet data files, plus metadata that says which files make up each version, plus an atomic way to commit a new version. The differences are in how the metadata is shaped and what each was optimised for first.
2. **The formats are converging, and the data files are largely interchangeable.** Deletion vectors, variant types and row lineage are appearing across formats; tools such as UniForm and XTable translate metadata so one copy of the data can be read as another format.
3. **Choosing is mostly about ecosystem and workload, not features.** Where your engines and catalog live, and whether you have heavy upserts or streaming, matters more than a feature checklist.

## 2. What makes it hard? (misconceptions to tackle)

| Misconception                                                  | Where we tackle it                                                     |
| -------------------------------------------------------------- | ---------------------------------------------------------------------- |
| "They store data differently" / "Iceberg files aren't Parquet" | Side-by-side simulation (step 2): the data files are all Parquet       |
| "One of them is simply the best"                               | Feature matrix (5) + choosing scenario (9): trade-offs, not a winner   |
| "Picking a format locks you in forever"                        | Interop (6–7): metadata translation over the same files                |
| "Switching format means copying all the data"                  | Interop (6): only metadata is rewritten                                |
| "The format war is about the file layout"                      | Convergence story (4) + catalogs (8): it's increasingly about catalogs |

## 3. Representation

- One table, `orders`, and the same three operations everywhere: INSERT 100 rows → UPDATE 1 row → ADD COLUMN.
- **Fixed format colours in this module:** each format gets a column; files use the track's semantic colours: data files `viz-data`, metadata/log files `viz-meta`, delete files/DVs `viz-remove`, catalog pointer `accent`.

## 4. What does the learner do?

| #   | Step                       | Interaction                                                                                                  | Gate   |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------------ | ------ |
| 1   | Same job, three designs    | Recap the three mental models (diary, library, kitchen rail) and the shared skeleton                         |        |
| 2   | Side by side ⭐            | **Simulation**: run INSERT, UPDATE, ADD COLUMN; three file explorers fill in; per-format update-mode toggles |        |
| 3   | Checkpoint                 | Whose file is it? Sort file names into Delta / Iceberg / Hudi                                                | sort   |
| 4   | How they grew together ⭐  | **Scroll story**: origins → copying each other's features → translation layers → shared catalogs             |        |
| 5   | Feature by feature         | Animated matrix: pick a capability, see how each format does it, with the nuance                             |        |
| 6   | One copy, many formats     | UniForm vs XTable: one set of Parquet files, extra metadata for other readers                                |        |
| 7   | Checkpoint                 | Delta writers, Iceberg readers: least-effort option                                                          | choice |
| 8   | Catalogs: the new frontier | Why the catalog now matters as much as the format                                                            |        |
| 9   | Choose for a project       | **Branching scenario**: answer a few questions about a project, get a reasoned recommendation                |        |
| 10  | Newer entrants             | DuckLake, Apache Paimon, Lance: what problem each targets                                                    |        |
| 11  | Takeaways                  | Chapter 2 summary                                                                                            |        |

## 5. How will we know it landed? (checkpoints)

- Step 3: `_delta_log/…json` and deletion-vector `.bin` → Delta; `metadata.json`, `snap-…avro` → Iceberg; `.hoodie/timeline/…` and `.log.` files → Hudi.
- Step 7: UniForm on the Delta table (or XTable if not on a UniForm-capable platform), not copying the data.
