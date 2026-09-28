# Sources (fact-checked 2026-09-28, before building)

Full notes: scratchpad `agile/m17-facts.md`.

- Martin Fowler, "Continuous Integration" (2000; rewritten 2006 and 2024) and "FrequencyReducesDifficulty" (2011): "If it hurts, do it more often." "Patterns for Managing Source Code Branches" (2020): branches "diverge exponentially as they run without integrating".
- Kent Beck, _Extreme Programming Explained_ (1999): "turn all the knobs up to 10"; ten-minute build; _Test-Driven Development: By Example_ (2002), red–green–refactor. Beck made CI a practice; Microsoft's daily builds (McConnell, 1996) came earlier; Booch used the phrase in passing.
- Martin Fowler, _Refactoring_ (1999): definition quoted in the glossary.
- DORA (dora.dev): five metrics (change lead time, deployment frequency, failed deployment recovery time, change fail rate, deployment rework rate, added 2024); "speed and stability are not tradeoffs"; trunk-based development: three or fewer active branches, merged at least daily, no code freezes.
- Don Reinertsen, _The Principles of Product Development Flow_ (2009): reducing batch size reduces cycle time, accelerates feedback and reduces risk; optimum batch size is a U-curve set by transaction cost.
- Nagappan et al. (2008): 40–90% fewer pre-release defects at four industrial teams; managers estimated 15–35% more initial time. Hannay et al. (2009) pair-programming meta-analysis (18 studies).
- Jez Humble: continuous delivery vs continuous deployment. Pete Hodgson, "Feature Toggles" (martinfowler.com, 2016/2017).
- SEC order on Knight Capital (16 Oct 2013): about $460 million lost in about 45 minutes after a deployment missed one server and a reused flag reactivated old code. Cited for flag hygiene, not batch size.
- Group-project figures and simulation rates are illustrative.
