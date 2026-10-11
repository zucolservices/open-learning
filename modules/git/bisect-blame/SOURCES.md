# Sources: Bisect and blame (fact-checked 2026-10-11)

- git-bisect (start/good/bad, about log2(n) steps; `bisect run`: exit 0 good, 1–127 bad except 125 skip, others abort; `skip`; `--reset-when-found` in 2.56).
- git-blame (-w, -C, -M; --ignore-rev and blame.ignoreRevsFile since 2.23; --diff-algorithm in 2.53). GitHub honours `.git-blame-ignore-revs` automatically; GitLab supports it as an opt-in blame preference (17.10–17.11, 2025); locally it needs blame.ignoreRevsFile.
- git-log (-S pickaxe, -p, --grep).

Full notes: scratchpad `sd/git/m17-facts.md`. The commits, file and authors are made up.
