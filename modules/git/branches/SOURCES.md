# Sources: Branches are pointers (fact-checked 2026-10-11)

- Pro Git §3.1 ("a branch in Git is simply a lightweight movable pointer"); gitrepository-layout (refs/heads files, packed-refs); RelNotes 2.45 (reftable backend), 2.51 (reftable planned as default in Git 3.0).
- RelNotes 2.28 (init.defaultBranch, Jul 2020); GitHub changelog (main as default for new repositories, Oct 2020); RelNotes 2.52 / BreakingChanges (main planned as default for new repositories in Git 3.0; plain git init currently uses master with a hint).
- git-switch (-c), git-branch (-d refuses unmerged branches; -D forces).

Full notes: scratchpad `sd/git/m05-facts.md`. The graph and IDs are simulated.
