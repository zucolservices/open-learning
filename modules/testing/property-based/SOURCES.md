# Sources: Property-based testing and fuzzing (fact-checked 2026-10-11)

- Claessen & Hughes, "QuickCheck: A Lightweight Tool for Random Testing of Haskell Programs" (ICFP 2000). Hypothesis, fast-check, proptest, FsCheck; jqwik README: "pure maintenance mode" (2026).
- Fuzzing: AFL++ (original AFL no longer developed); libFuzzer in maintenance mode (LLVM docs; authors moved to Centipede, now in FuzzTest); Go native fuzzing (Go 1.18, 15 Mar 2022).
- OSS-Fuzz README (as of May 2025): over 13,000 vulnerabilities and 50,000 bugs across 1,000 projects. Google Security Blog (20 Nov 2024): AI-generated fuzz targets found 26 new vulnerabilities, incl. OpenSSL CVE-2024-9143 (low severity, likely ~20 years old).

Full notes: scratchpad `sd/testing/m17-facts.md`. The sort implementations are made up; the property tester and shrinking run in the browser.
