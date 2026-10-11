# Sources: Code coverage (fact-checked 2026-10-11)

- Arguelles, Ivanković & Bender, "Code Coverage Best Practices", Google Testing Blog (7 Aug 2020): 60% acceptable, 75% commendable, 90% exemplary; Google avoids broad top-down mandates; per-commit 99% reasonable, 90% lower threshold.
- DO-178C: Level A MC/DC, Level B decision coverage, Level C statement coverage.
- Goodhart's law: popular wording is Marilyn Strathern's 1997 paraphrase of Goodhart (1975).
- Tools: JaCoCo, coverage.py (sysmon core default on Python 3.14+), Istanbul/nyc, V8 coverage (Vitest's @vitest/coverage-v8; c8 is a separate CLI), go test -cover.

Full notes: scratchpad `sd/testing/m13-facts.md`. The discount function and its bug are made up; the tests really run and coverage is computed from the paths each test takes.
