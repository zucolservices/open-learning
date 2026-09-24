# Storyboard: Back-of-the-envelope estimation

Track: System Design at Scale · Chapter 1 · Module 3 · ~25 min · level: core

## Steps

| #   | Step                         | Interaction                                                                        | Gate    |
| --- | ---------------------------- | ---------------------------------------------------------------------------------- | ------- |
| 1   | Good-enough numbers, fast ⭐ | **Step-through**: a Fermi estimate of Brewline's lunch peak (≈600 req/s)           |         |
| 2   | The estimator ⭐             | **Simulation**: users → requests/s → peak → writes → storage → bandwidth → servers |         |
| 3   | The latency ladder ⭐        | Six rungs, real time vs "1 ns = 1 s", log bars                                     |         |
| 4   | India's payments, per second | UPI ≈ 790M/day → ≈ 9,100/s                                                         | predict |
| 5   | How much storage?            | 1M photos × 2 MB × 5 years ≈ 3.7 PB                                                | choice  |
| 6   | Rules of thumb               | Numbers sheet                                                                      |         |
| 7   | What to remember             |                                                                                    |         |
