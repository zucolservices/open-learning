# Sources: Flaky tests (fact-checked 2026-10-11)

- John Micco, "Flaky Tests at Google and How We Mitigate Them", Google Testing Blog (27 May 2016): ~1.5% of test runs flaky; almost 16% of tests some flakiness; ~84% of pass→fail transitions involved a flaky test.
- Luo, Hariri, Eloussi & Marinov, "An Empirical Analysis of Flaky Tests" (FSE 2014): of 161 classifiable fixes in Apache projects, async wait 45%, concurrency 20%, test order dependency 12%.
- Jest `--randomize` (29.5.0; shuffles within a file), pytest-randomly, JUnit `MethodOrderer.Random` (JUnit 6.0, Sep 2025); `@Order` fixes order (hides dependencies). Buildkite Test Engine Workflows (Oct 2025 preview) detect and mute flaky tests; GitHub Actions has no built-in detection; GitLab shows recent failure counts in MR test reports.

Full notes: scratchpad `sd/testing/m15-facts.md`. The suite, causes and rates are made up and seeded.
