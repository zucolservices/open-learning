# Workload identity and federation (Cloud Architecture, module 10)

1. **House keys and visitor badges** (analogy): spare key (long-lived, copied) vs visitor badge (checked, expires tonight).
2. **Follow a leaked key** ⭐ (step-through, real timings): push → AWS quarantine ≈10 s → attackers ≤5 min → still valid months later → clean-up. Incident cards: Uber, Toyota, Codecov, CircleCI. CloudSEK India apps.
3. **Credentials without keys** ⭐ (explore): where code runs (VM, pod, function, CI, outside) × cloud → mechanism, with a three-hop flow to a ≈1-hour token.
4. **A pipeline without secrets** ⭐ (simulation): GitHub OIDC trust policy with no sub check / whole org / one repo main branch; which of four callers can deploy. Datadog 2023, AWS June 2025 guard, GitHub July 2026 sub format.
5. **One login for people** (explore): SSO, SAML, OIDC, SCIM, per-cloud services.
6. **Swap the key** (sort checkpoint): attached identity / workload federation / single sign-on.
7. **Wrap**.
