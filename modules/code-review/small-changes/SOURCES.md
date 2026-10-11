# Sources: Small changes (fact-checked 2026-10-11)

- Google Engineering Practices, "Small CLs": "100 lines is usually a reasonable size for a CL, and 1000 lines is usually too large…"; ways to split (stacking, by files, horizontal, vertical, separate refactorings).
- Sadowski et al. (ICSE-SEIP 2018): median change 24 lines.
- SmartBear/Cisco (Jason Cohen, _Best Kept Secrets of Peer Code Review_, 2006): one team, 2,500 reviews; "under 200, not to exceed 400" lines; under 60 minutes, not exceeding 90. Vendor study, not peer-reviewed. The "70–90% of defects" figure is marketing-only and not used.
- GitHub stacked pull requests: public preview 30 Jul 2026, GA 6 Oct 2026 (`gh stack`). Graphite, Sapling, git-branchless; Gerrit change chains.

Full notes: scratchpad `sd/code-review/m05-facts.md`. The 1,200-line change, waiting times and threshold are made up and illustrative.
