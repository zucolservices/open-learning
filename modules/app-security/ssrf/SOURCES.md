# Sources: Server-side request forgery (fact-checked 2026-10-07)

- CWE-918 Server-Side Request Forgery (#22 in the MITRE CWE Top 25 2025).
- OWASP Top 10: A10:2021 SSRF (community-survey top pick); folded into A01 in 2025. OWASP SSRF Prevention Cheat Sheet (allow-list, resolve and pin the IP, disable redirects, don't return raw responses, network segmentation).
- Capital One (2019): DOJ/OCC wording "misconfigured web application firewall"; the SSRF-to-metadata account is from security researchers (Krebs) and the Wyden/Warren letter. Capital One: ~100M US and ~6M Canada. OCC civil penalty $80M (6 Aug 2020).
- AWS IMDSv2 (19 Nov 2019): PUT for a session token, default hop limit 1, rejects X-Forwarded-For; account-level default for new instances opt-in from 25 Mar 2024. Google Cloud requires `Metadata-Flavor: Google`; Azure requires `Metadata: true`; both reject X-Forwarded-For.

The image-preview lab is a rules-based simulation; destinations are described, not real addresses, and no payloads are shown.
