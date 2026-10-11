# Sources: Reviewing for security (fact-checked 2026-10-11)

- OWASP Code Review Guide v2 (July 2017) — still current; no v3. OWASP Secure Code Review Cheat Sheet (baseline vs diff-based; input, authn, authz, crypto, logic, config, logging).
- Edmundson, Holtkamp, Rivera, Finifter, Mettler, Wagner, "An Empirical Study on the Effectiveness of Security Code Review", ESSoS 2013 — 30 developers, none found all vulnerabilities; experience did not predict accuracy.
- GitHub code scanning / secret scanning / push protection; GitHub Secret Protection and Code Security split (effective 1 Apr 2025). Vendor-neutral equivalents: GitLab SAST & Secret Detection, Semgrep, SonarQube, Snyk Code, gitleaks.

Safety: rules-based simulation only. The secret is a placeholder; attacks are described in words. The endpoint is made up. Notes: scratchpad `sd/code-review/m12-facts.md`.
