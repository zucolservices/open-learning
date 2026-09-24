# Storyboard: The slow, expensive lakehouse (capstone)

Track: Modern Data Lakehouse · Chapter 9 · Module 29 · ~35 min · level: applied

Five compounding problems in Brewline's lakehouse six months after launch: small files from 10-second streaming commits, no snapshot expiry or orphan clean-up, a function-wrapped dashboard filter (no pushdown), unclustered data (useless min/max), and append-only silver writes duplicated by retries.

## Steps

| #   | Step                          | Interaction                                                                                       | Gate   |
| --- | ----------------------------- | ------------------------------------------------------------------------------------------------- | ------ |
| 1   | Six months later ⭐           | **Scroll story**: load time and bill creep month by month; finance finds a 3% gap; doctor analogy |        |
| 2   | Investigate and fix ⭐        | **Fix the problem**: 5 evidence tabs, 9 fixes (4 red herrings), live health metrics (no score)    |        |
| 3   | Why didn't more workers help? | Remove wasted work before scaling out                                                             | choice |
| 4   | So it never happens again     | Sort guardrails into files, upkeep, queries, pipelines                                            | sort   |
| 5   | The whole lakehouse           | End-of-track recap of all nine chapters                                                           |        |
