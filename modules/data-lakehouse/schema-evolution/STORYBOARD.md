# Storyboard: Schema evolution & enforcement

Track: Modern Data Lakehouse · Chapter 3 · Module 12 · ~25 min · level: core

The Iceberg module already demonstrated field IDs (rename/drop/re-add by name vs by ID). This module assumes only `what-makes-a-table`, so it re-grounds that idea through a realistic incident, and adds enforcement, type changes and semi-structured data.

## 1. What must the learner truly understand?

1. **Enforcement and evolution are two sides of one contract.** Enforcement keeps bad data out; evolution lets the contract change on purpose. A table format does both; a folder of files does neither.
2. **Enforcement is all-or-nothing per write.** A write that breaks the schema fails as a whole, and nothing is committed.
3. **How old files are matched to the current schema decides whether a change is safe.** By position, by name, or by ID: each has a failure mode, and only IDs survive renames and drops.
4. **Type changes are safe only when they widen.** Anything else needs a rewrite.

## 2. Misconceptions

| Misconception                                       | Where                          |
| --------------------------------------------------- | ------------------------------ |
| "A rename is just a label; it can't break data"     | Incident (3)                   |
| "Enforcement drops the bad rows and keeps the rest" | The front desk (1)             |
| "Evolution means any change is allowed"             | Change menu (4), type sort (5) |
| "Semi-structured data means giving up on schemas"   | Nested & variant (6)           |

## 3. What does the learner do?

| #   | Step                     | Interaction                                                                                                                                                                                 | Gate   |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1–2 | The front desk           | Send a batch of mixed rows into a folder vs an enforced table; see why the whole write fails; then switch on schema evolution and see what's added vs still rejected (merged into one step) |        |
| 3   | The Monday incident ⭐   | **Fix the problem**: revenue is ₹0 after a rename; inspect clues, find the cause, choose a fix, replay with IDs                                                                             | choice |
| 4   | The change menu          | Add / drop / rename / reorder / widen: per format, metadata-only or not, and what's required                                                                                                |        |
| 5   | Checkpoint               | Sort type changes into safe widening vs needs a rewrite                                                                                                                                     | sort   |
| 6   | Nested & semi-structured | Evolving events: string blob vs struct vs VARIANT                                                                                                                                           |        |
| 7   | Takeaways                |                                                                                                                                                                                             |        |
