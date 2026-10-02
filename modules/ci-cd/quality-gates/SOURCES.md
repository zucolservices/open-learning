# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `cicd/m07-facts.md` (raw pages in `cicd/m07/`).

- GitHub Docs, protected branches and rulesets (rulesets GA 24 July 2023): required status checks, "Require branches to be up to date before merging", required approving reviews, "Require review from Code Owners", "Do not allow bypassing the above settings" (admins bypass by default). CODEOWNERS in `.github/`, root or `docs/`.
- GitHub Docs, "Troubleshooting required status checks": a workflow skipped by path filtering leaves its required check "Pending"; a job skipped by a condition reports success.
- GitHub merge queue GA 12 July 2023 (organisation-owned repositories); GitLab merge trains (Premium and Ultimate). bors-ng archived 4 April 2024.
- Martin Fowler, "semantic conflict".
- GitHub Secret Protection ($19) and Code Security ($30) per active committer per month from 1 April 2025; secret scanning and push protection free on public repositories. SonarQube Cloud (formerly SonarCloud, renamed October 2024).
- Google Engineering Practices, "The Standard of Code Review": reviewers "should favor approving a CL once it is in a state where it definitely improves the overall code health of the system being worked on, even if the CL isn't perfect."
- Sadowski et al., "Modern Code Review: A Case Study at Google" (ICSE-SEIP 2018): median review latency under 4 hours; median change size 24 lines.
- DORA, "Streamlining change approval": external change approval has "a negative impact on software delivery performance"; "no evidence" it lowers change fail rates; recommends peer review plus automation.
- PCI DSS v4.0.1 requirement 6.5 (change management) and SOC 2 CC8.1: authorised, documented change approval.
- The nine pull requests, their problems and all waiting times are illustrative.
