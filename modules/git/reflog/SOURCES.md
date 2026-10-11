# Sources: The reflog (fact-checked 2026-10-11)

- git-reflog (records when the tips of branches and other references were updated in the local repository; HEAD@{n} and @{yesterday} syntax; `reflog drop` in 2.50); git-config gc.reflogExpire (default 90 days) and gc.reflogExpireUnreachable (30 days); git-gc gc.pruneExpire (2 weeks); git-fsck --lost-found; git-branch -D prints the deleted tip.
- Local checks on git 2.48 (reset --hard recorded in reflog; staged blob recoverable via fsck).

Full notes: scratchpad `sd/git/m15-facts.md`. Commits and IDs are simulated.
