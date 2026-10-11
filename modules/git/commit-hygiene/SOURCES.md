# Sources: Commit messages and history hygiene (fact-checked 2026-10-11)

- Git's Documentation/SubmittingPatches (subject around 50 characters, imperative mood, explain why; Developer Certificate of Origin and Signed-off-by via `git commit -s`). The ~72-column body wrap is a community convention, not in Git's docs.
- git-commit (--fixup), git-rebase (--autosquash).
- Conventional Commits 1.0.0 (only feat and fix are required types; `!` or a BREAKING CHANGE footer marks breaking changes; maps to SemVer). semantic-release defaults to the Angular preset.

Full notes: scratchpad `sd/git/m13-facts.md`. Imran, the café and the email addresses are made up.
