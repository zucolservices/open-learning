# Secrets and identity in pipelines (CI/CD, module 17)

1. **A stranger's pull request** ⭐ (fix the problem): six weaknesses (stored key, pull_request_target, write-all token, secrets in logs, persistent self-hosted runner, tag-pinned action) vs six attacker moves; fix each.
2. **No key to steal** (step-through): the OIDC exchange and a pinned trust policy.
3. **It keeps happening** (real incidents): Codecov 2021, CircleCI 2023, tj-actions 2025; leaked-secret scale.
4. **Safe or risky?** (sort checkpoint).
5. **Wrap**: GitHub's tightened defaults.
