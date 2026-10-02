# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `cicd/m05-facts.md` (raw pages in `cicd/m05/`).

- Mike Cohn, _Succeeding with Agile_ (2009): the "Test Automation Pyramid" (UI, Service, Unit). Martin Fowler, bliki "TestPyramid" (1 May 2012): "many more low-level UnitTests than high level BroadStackTests running through a GUI." Ham Vocke, "The Practical Test Pyramid" (26 Feb 2018).
- _Software Engineering at Google_ (O'Reilly, 2020), ch. 11: "around 80% … unit … 15% … integration … and 5% end-to-end"; the ice-cream cone anti-pattern.
- John Micco, Google Testing Blog, "Flaky Tests at Google and How We Mitigate Them" (27 May 2016): "about 1.5% of all test runs reporting a 'flaky' result"; "Almost 16% of our tests have some level of flakiness".
- Martin Fowler, "Eradicating Non-Determinism in Tests" (14 Apr 2011): non-deterministic tests are "useless" and "a virulent infection".
- Google Testing Blog, "Code Coverage Best Practices" (7 Aug 2020): 60% acceptable, 75% commendable, 90% exemplary; coverage doesn't guarantee quality.
- Test quarantine and flaky-test tooling exist in Datadog, Buildkite Test Engine, Trunk and CircleCI; GitHub Actions offers re-runs only.
- The checkout service, the 20 bugs, test timings, flake rates and catch rates in the simulation are illustrative.
