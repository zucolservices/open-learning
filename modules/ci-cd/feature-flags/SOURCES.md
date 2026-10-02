# Sources (fact-checked 2026-10-03, before building)

Full notes: scratchpad `cicd/m14-facts.md` (raw pages in `cicd/m14/`).

- Pete Hodgson, "Feature Toggles (aka Feature Flags)" (martinfowler.com, 2016, updated 9 Oct 2017): release, experiment, ops and permissioning toggles (definitions quoted); release toggles "should generally not stick around much longer than a week or two"; "separating [feature] release from [code] deployment"; "Savvy teams view their Feature Toggles as inventory which comes with a carrying cost, and work to keep that inventory as low as possible."
- LaunchDarkly docs: percentage rollouts hash the flag key, a salt and the context key (SHA-1) into 100,000 buckets; SDKs receive changes by streaming and evaluate locally; kill-switch flags are permanent by design. Unleash and flagd use MurmurHash.
- OpenFeature: CNCF incubating since 21 Nov 2023; flagd reference provider. Tools: LaunchDarkly, Unleash (AGPL-3.0 since May 2026), Flagsmith, GrowthBook, ConfigCat, Optimizely, AWS AppConfig, Azure App Configuration, Firebase Remote Config. Split acquired by Harness (Jun 2024); Statsig acquired by OpenAI (Sep 2025), product run by Amplitude since May 2026.
- US SEC, Release No. 34-70694 (2013), Knight Capital: new code "repurposed a flag that was formerly used to activate the Power Peg code"; about 45 minutes; more than $460 million.
- Ramanathan et al., "Piranha: Reducing Feature Flag Debt at Uber" (ICSE-SEIP 2020): 1,381 flags cleaned up between Dec 2017 and May 2019.
- Google Cloud incident report (12 Jun 2025): "did not have appropriate error handling nor was it feature flag protected"; commitment to make changes to critical binaries "feature flag protected and disabled by default".
- Evan Miller, "How Not To Run an A/B Test": fixed sample sizes.
- The 200 users, the bug and the timeline in the simulation are illustrative; the bucketing uses a small FNV-1a hash in place of SHA-1 or MurmurHash.
