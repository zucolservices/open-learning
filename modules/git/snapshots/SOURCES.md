# Sources: Snapshots, not differences (fact-checked 2026-10-11)

- Pro Git §10.2 "Git Objects" and §10.4 "Packfiles"; gitformat-pack (OFS/REF deltas). Object ID = SHA-1 of "<type> <size>\0<content>" ("hello\n" → ce013625…464a); tree entries "<mode> <name>\0<20-byte id>"; commit text with tree, parent, author, committer, message. IDs in this module are computed in the browser and were checked against git 2.48 (`write-tree`, `commit` with fixed author and date).
- RelNotes 2.13.0 (SHA-1 collision detection made default, after SHAttered, Feb 2017); 2.29.0 (SHA-256 support, experimental); 2.42 (no planned breaking changes to SHA-256 repos); 2.52 (start of SHA-1/SHA-256 interoperability work, not usable yet). BreakingChanges: SHA-256 planned as default for new repositories in Git 3.0, no date.

Full notes: scratchpad `sd/git/m02-facts.md`. The café files and author are made up.
