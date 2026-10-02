# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `cloud/m10-facts.md`.

- Leaks: GitHub blog (1 Apr 2025) "more than 39 million secrets leaked across GitHub in 2024". GitGuardian State of Secrets Sprawl: 23.8M new secrets on public GitHub in 2024; 2026 report 28.65M ("29M") in 2025; over 64% of secrets valid in 2022 still valid in Jan 2026. Unit 42 EleKtra-Leak (Oct 2023): leaked AWS keys used within 5 minutes; a 2026 Unit 42 test saw AWSCompromisedKeyQuarantineV3 attached ≈10 s after publication (policy V1 2020, V2 2021, V3 Aug 2024; blocks risky actions only). CloudSEK (2021, BeVigil): 40+ Indian mobile apps with hardcoded AWS keys.
- Incidents: Uber 2016 (AWS key in private GitHub repo, 57M people); Toyota T-Connect (access key in public code Dec 2017–15 Sep 2022, 296,019 emails); Codecov 2021 (GCS key extracted from Docker image; 31 Jan–1 Apr 2021); CircleCI 4 Jan 2023 ("any and all" secrets).
- AWS: AKIA long-term vs ASIA temporary keys; AssumeRole default 1 h, max 1–12 h, role chaining 1 h; instance profiles, IMDSv2 (account default since Mar 2024); EKS Pod Identity (Nov 2023), IRSA; Lambda execution roles; IAM Roles Anywhere. Since June 2025 IAM rejects GitHub OIDC trust policies without a specific `sub` condition.
- Azure: managed identities (system/user-assigned), IMDS token (expires_in ≈1 h; back end caches up to 24 h); federated identity credentials (max 20); secrets max 24 months in portal.
- Google: attached service accounts, metadata server, access tokens 1 h; `iam.managed.disableServiceAccountKeyCreation` enforced by default for organisations created on/after 3 May 2024; Workload Identity Federation; GKE Workload Identity Federation.
- CI: GitHub Actions OIDC (`id-token: write`), `sub` claim; new immutable-ID sub format for repos created after 15 July 2026. Datadog Security Labs (Jul 2023): 500+ vulnerable roles in 275+ AWS accounts. GitLab `id_tokens`.
- People: SAML 2.0 (Mar 2005), OpenID Connect (26 Feb 2014), SCIM; AWS IAM Identity Center (renamed from AWS SSO 26 Jul 2022), Microsoft Entra ID (renamed from Azure AD, announced 11 Jul 2023), Google Workforce Identity Federation. All free.
- SPIFFE/SPIRE graduated from CNCF (Sep 2022).
