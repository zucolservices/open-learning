# Sources: Hooks and automation (fact-checked 2026-10-11)

- githooks docs (pre-commit, prepare-commit-msg, commit-msg, post-commit, pre-push; pre-receive, update, post-receive); git-commit --no-verify (skips pre-commit and commit-msg, not prepare-commit-msg); core.hooksPath (2.9); `git hook run` (2.36, Apr 2022); config-based hooks `hook.<name>.command`/`.event` (2.54, Apr 2026) and parallel hooks (2.55, Jun 2026). Hooks are not copied by clone.
- pre-commit (pre-commit.com), Husky (v9.1.7 latest, not deprecated), lefthook.

Full notes: scratchpad `sd/git/m21-facts.md`. The café repository and file are made up; the hook simulation is rules-based.
