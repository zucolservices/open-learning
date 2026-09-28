# Small batches & continuous integration: storyboard

1. **The group project** (analogy): four friends write a 10-day report; toggle "merge the night before" (one huge clash) vs "merge every day" (ten tiny ones).
2. **Batch-size lab** ⭐ (simulation): a five-person team over a 10-day Sprint. Choose integration interval, release interval (never more often than integration) and manual vs automated testing/deploy. Lead time, hours lost, changes per release, and stacked bars of merge / release overhead / broken-release clean-up for each release interval. With manual releases, big batches look cheapest; with automation the U-curve's bottom moves to small batches. Toy model (`model.ts`).
3. **What to fix first?** (choice): monthly releases with two-day manual regression; automate first.
4. **Practices from XP** (step-through): TDD red, green, refactor on a tiny GST function; pair programming; continuous integration with a ten-minute build.
5. **What the evidence says** (sort): DORA speed + stability, the U-curve caveat, Nagappan 2008 TDD, pair-programming overclaim.
6. **What to remember**: DORA's five delivery metrics, feature flags with the Knight Capital caution, trunk-based development, continuous delivery vs deployment, "If it hurts, do it more often".
