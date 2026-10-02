# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `cicd/m17-facts.md` (raw pages in `cicd/m17/`). Attacks are described at the level of ideas only.

- GitHub Docs, "OpenID Connect": "No cloud secrets: You won't need to duplicate your cloud credentials as long-lived GitHub secrets"; a short-lived access token "only valid for a single job"; `id-token: write`; claims such as sub, repository, ref, environment. Immutable subject format with owner and repository IDs for repositories created after 15 July 2026.
- GitHub Docs, secure use reference: "Never use structured data as a secret"; register transformed values; add-mask; delete the log and rotate on a leak; self-hosted runners "should almost never be used for public repositories"; "Pinning an action to a full-length commit SHA is currently the only way to use an action as an immutable release."
- GitHub: pull_request from forks gets no secrets and a read-only token; pull_request_target always uses the default branch's workflow since 8 Dec 2025; read-only default token for new organisations and repositories since 2 Feb 2023; SHA-pinning policy (Aug 2025).
- Codecov security update (Apr 2021): Bash uploader altered 31 Jan – 1 Apr 2021 to export environment variables.
- CircleCI incident report (Jan 2023): malware on an engineer's laptop stole an SSO session; customers told to rotate all secrets.
- tj-actions/changed-files (CVE-2025-30066, 14–15 Mar 2025): tags re-pointed; secrets printed base64-encoded into logs; 23,000+ repositories used the action.
- GitGuardian, State of Secrets Sprawl 2026: 28,649,024 new secrets detected in public GitHub commits in 2025.
- GitLab id_tokens and masked/hidden variables; Azure DevOps workload identity federation (GA 12 Feb 2024); HashiCorp Vault JWT/OIDC auth.
- The repository, its weaknesses and the trust policy are illustrative.
