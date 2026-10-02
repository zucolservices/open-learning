# Sources (2026-10-02)

The capstone introduces no new external facts. Every finding reuses a claim fact-checked for an earlier module (scratchpad `cloud/m05`–`m21-facts.md`):

- Overlapping ranges can't be connected (m05, m14); peering count n(n−1)/2 → 105 at 15 networks (m07).
- Leaked long-lived keys used within minutes (m10, Unit 42 EleKtra-Leak); SSO and OIDC federation (m10).
- Preventive guardrails: India regions only, no public storage, required tags (m12).
- Customer-managed KMS keys and secret managers; external key stores' availability risk (m11).
- CERT-In 180-day log retention within India (m11, m20); central log archive (m14).
- Pilot light: "RPO in minutes, RTO in tens of minutes"; active-active costs at least double (m17); backups abroad break residency (m20).
- Commitments bill every hour; savings plans for the floor (m18); budgets as a high-risk issue, COST01-BP03 (m19).
- Infrastructure as code with plans and policy checks (m12, m15).
- The department, its targets and the colleague's findings are illustrative.
