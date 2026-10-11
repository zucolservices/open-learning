# Sources: Signing and secrets in history (fact-checked 2026-10-11)

- git-commit -S, git-config commit.gpgsign and gpg.format (openpgp, x509, ssh; SSH signing since 2.34, Nov 2021). GitHub Docs (verified commits, vigilant mode) and GitLab Docs (signed commits). Sigstore gitsign (keyless; not shown as Verified by GitHub or GitLab, per secondary sources).
- git-filter-branch docs (recommends git filter-repo instead); git-filter-repo README; BFG Repo-Cleaner. GitHub secret scanning push protection: on by default for user pushes to public repositories since 29 Feb 2024.
- No real secrets appear in this module.

Full notes: scratchpad `sd/git/m20-facts.md`. Meera, the café and the key are made up.
