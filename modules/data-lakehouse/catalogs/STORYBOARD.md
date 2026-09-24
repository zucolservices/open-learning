# Storyboard: Catalogs, the source of truth

Track: Modern Data Lakehouse · Chapter 5 · Module 16 · ~30 min · level: core

## What must the learner understand?

1. A catalog maps table names to where a table lives and which version is current, so consumers survive moves and agree on "latest".
2. Every engine that asks the same catalog sees the same commits; readers pinned to a file or registered in another catalog go stale. One catalog owns each table's commits.
3. The Iceberg REST API standardised loading, committing (requirements + updates, 409 on conflict) and credential vending, and most modern catalogs serve it.
4. Some catalogs branch the whole catalog and commit many tables atomically.

## Steps

| #   | Step                | Interaction                                                                                   | Gate   |
| --- | ------------------- | --------------------------------------------------------------------------------------------- | ------ |
| 1   | A contact list      | Paths vs catalog; move the table and see who breaks                                           |        |
| 2   | Three engines ⭐    | **Build and connect**: Spark commits; Trino/DuckDB pinned vs catalog-connected; versions seen |        |
| 3   | Checkpoint          | Two catalogs, one table (split brain)                                                         | choice |
| 4   | A commit over REST  | Step-through of config → loadTable (+ vended credentials) → write → commit → 200/409          |        |
| 5   | Who's who           | Filterable catalog landscape                                                                  |        |
| 6   | Branching a catalog | Iceberg per-table branches vs Nessie catalog-wide branch                                      |        |
| 7   | Checkpoint          | Why a common catalog API matters                                                              | choice |
| 8   | Takeaways           |                                                                                               |        |
