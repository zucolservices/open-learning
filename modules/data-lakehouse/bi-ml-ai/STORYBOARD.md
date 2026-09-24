# Storyboard: Serving BI, ML & AI

Track: Modern Data Lakehouse · Chapter 7 · Module 23 · ~25 min · level: applied

## What must the learner understand?

1. Dashboards, training, live predictions and AI assistants read the same gold tables but need different serving layers.
2. A semantic layer defines metrics once for every tool (and grounds AI assistants).
3. Training data must be point-in-time correct; leakage shows as a training/production gap.
4. Vector indexes are copies: keep them fresh from change feeds and enforce permissions yourself.

## Steps

| #   | Step                              | Interaction                                                          | Gate   |
| --- | --------------------------------- | -------------------------------------------------------------------- | ------ |
| 1   | One copy, four customers ⭐       | **Scroll story / animated infographic** (central kitchen analogy)    |        |
| 2   | Revenue means one thing           | Three tools, three numbers → one semantic definition                 |        |
| 3   | The time-travel trap ⭐           | Today's vs as-of features: 100% training vs 67% production           |        |
| 4   | Spot the leak                     | Fraud model gap                                                      | choice |
| 5   | An assistant on your documents ⭐ | RAG lab: stale policy chunk, salary leak; sync + access filter fixes |        |
| 6   | Route each request                | Sort requests into serving layers                                    | sort   |
| 7   | Who serves what                   | Toolbox                                                              |        |
| 8   | What to remember                  |                                                                      |        |
