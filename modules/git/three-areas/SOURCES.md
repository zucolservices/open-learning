# Sources: The three areas (fact-checked 2026-10-11)

- git-status docs: short format "XY PATH"; X = index vs HEAD, Y = working tree vs index; codes M, A, D, R, ??; e.g. " M", "MM", "??" checked locally.
- git-add (-p, interactive hunk staging), git-restore (--staged copies HEAD into the index; without options discards working-tree changes). RelNotes 2.23 (switch and restore added, Aug 2019) and 2.51 (no longer experimental, Aug 2025). BreakingChanges: checkout, switch and restore "will stay".
- Pro Git §2.2 and §10 (index stored in .git/index; staged content written as blobs).

Full notes: scratchpad `sd/git/m03-facts.md`. The café files are made up; the simulation models changes as hunk counts.
