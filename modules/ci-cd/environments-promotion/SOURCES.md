# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `cicd/m10-facts.md` (raw pages in `cicd/m10/`).

- The Twelve-Factor App (12factor.net; open-sourced by Heroku in November 2024, community revision in progress), "III. Config": "strict separation of config from code"; litmus test "whether the codebase could be made open source at any moment, without compromising any credentials". "X. Dev/prod parity": "Keep development, staging, and production as similar as possible"; the time, personnel and tools gaps (quoted).
- GitHub Docs, deployment environments: required reviewers (up to 6; one approval suffices), wait timer up to 43,200 minutes (30 days), deployment branches and tags, environment secrets. On private repositories, reviewers and wait timers need GitHub Enterprise.
- GitLab protected environments and deployment approvals (Premium/Ultimate); review apps (Free); `environment:auto_stop_in`. Azure Pipelines environments with approvals and checks.
- Preview environments: Vercel Preview Deployments, Netlify Deploy Previews, Render Preview Environments, Heroku Review Apps.
- Charity Majors (Increment, 2019): each deploy is "a unique and never-to-be-replicated combination of artifact, environment, infra, and time of day".
- GDPR Art. 5(1)(c) data minimisation; India's Digital Personal Data Protection Act 2023 and Rules (notified November 2025, phased in).
- payments-api, its versions, settings and the webhook bug are illustrative.
