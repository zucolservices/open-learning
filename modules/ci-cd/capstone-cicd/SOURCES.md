# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `cicd/m21-facts.md` (raw pages in `cicd/m21/`). Each decision and outcome draws on the earlier modules' fact-checked sources.

- NPCI data, as reported 1 Oct 2026: UPI handled 24.07 billion transactions in September 2026.
- CrowdStrike (19 Jul 2024): content update at 04:09 UTC, reverted 05:27 UTC; about 8.5 million Windows devices (Microsoft's estimate); root cause analysis commits to canary testing and wider deployment rings.
- Google Cloud incident report (12 Jun 2025): policy data with blank fields "replicated globally within seconds"; the code path was not "feature flag protected"; about three hours.
- Shai-Hulud npm worm: CISA alert 23 Sep 2025, "over 500 packages".
- GitHub: secrets are not passed to workflows triggered by pull requests from forks (read-only GITHUB_TOKEN only).
- RBI, Master Directions on Cyber Resilience and Digital Payment Security Controls for non-bank Payment System Operators (30 Jul 2024), para 21: "Any change to system, technology, application, source code, etc., shall be managed using robust change management processes"; changes implemented in production "after testing and validating the same in other environments".
- The payments company, its releases, the findings and all outcomes are illustrative.
