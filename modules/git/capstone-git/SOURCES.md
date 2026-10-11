# Sources: Capstone, untangle a team's messy repository (fact-checked 2026-10-11)

- GitHub protected branches (force pushes blocked by default; deletion blocked) and rulesets ("Block force pushes" and "Restrict deletions" on by default; require pull request, status checks, signed commits, linear history; bypass lists): docs.github.com, managing-protected-branches and available-rules-for-rulesets.
- GitLab protected branches: the default branch is protected; force push off unless "Allowed to force push": docs.gitlab.com/user/project/repository/branches/protected/.
- Recovering a force-push: GitHub Activity view lists force pushes with the before-commit; old commits usually remain fetchable by ID until garbage collection; GitLab Events API push events carry commit_from/commit_to.
- Reflog expiry defaults (90 days reachable, 30 unreachable); `git push --force-with-lease` / `--force-if-includes`: git-scm.com/docs.

Full notes: scratchpad `sd/git/m22-facts.md`. The café team and its repository are made up; the graph is the shared in-browser repo model.
