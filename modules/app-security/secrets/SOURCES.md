# Sources: Secrets management (fact-checked 2026-10-07)

- GitGuardian, State of Secrets Sprawl 2026 (17 Mar 2026): ~28.6M new secrets on public GitHub in 2025 (+34%); 64% of 2022-leaked valid secrets still unrevoked by Jan 2026; 32% of internal repos vs 5.6% of public repos contain a secret.
- Uber 2016: AWS key in a private GitHub repo (FTC); 57M riders/drivers; $100,000 paid; $148M settlement (26 Sep 2018); Joe Sullivan convicted 5 Oct 2022 (upheld Mar 2025).
- Toyota T-Connect: access key public on GitHub Dec 2017–15 Sep 2022; 296,019 email addresses.
- GitHub secret scanning / push protection (free for public repos; default on for personal accounts pushing to public repos since Feb/Mar 2024). gitleaks (MIT); TruffleHog (AGPL-3.0).
- Secrets managers: HashiCorp Vault (BSL 1.1 since 2023; IBM acquisition completed 27 Feb 2025), OpenBao (OpenSSF), AWS Secrets Manager, Google Secret Manager, Azure Key Vault, Infisical (open-core). GitHub Actions OIDC (since 27 Oct 2021). OWASP Secrets Management Cheat Sheet (env-var risk). GitHub Docs: revoke/rotate first; old history stays in clones, forks, caches.

The repository, commits and key are made up.
