# Storyboard: ACID on object storage

Track: Modern Data Lakehouse · Chapter 3 · Module 10 · ~30 min · level: deep

## 1. What must the learner truly understand?

1. **ACID is four separate promises**, each protecting against a different failure: a crash mid-change (A), a broken rule (C), interference between concurrent work (I), and loss after success (D).
2. **A lakehouse keeps them without a database server.** Atomicity and isolation come from one small atomic commit (put-if-absent, a catalog pointer swap, or a completed instant) plus immutable files and snapshots; durability comes from object storage; consistency from checks before the commit.
3. **Concurrent writers are handled optimistically.** Nobody locks while working; at commit time the loser checks whether the winner changed anything it depended on. Whether two operations conflict depends on what they read and rewrote, and on the isolation level.
4. **Isolation levels trade safety for throughput.** A weaker level lets more writes succeed together, at the cost of allowing some outcomes that no one-at-a-time order could produce.

## 2. What makes it hard? (misconceptions to tackle)

| Misconception                                              | Where we tackle it                                          |
| ---------------------------------------------------------- | ----------------------------------------------------------- |
| "ACID needs a database server"                             | Scroll story (2): each promise mapped to storage + metadata |
| "Two writers at once always conflict" / "never conflict"   | Conflict lab (3) + checkpoint (4)                           |
| "Readers must wait for writers" (or see half-written data) | Scroll story, Isolation section                             |
| "Serializable is just 'more correct', so always pick it"   | Isolation levels (5): the throughput cost                   |
| "Atomic commits work the same on every cloud store"        | Commit coordinators (7)                                     |

## 3. Representation

- Opening: one bank transfer (Asha → Ravi, ₹500), with a "total money in the bank" meter that must stay constant.
- Lakehouse parts: `orders` table partitioned by date, versions v10, v11…; two writers A (viz-compute) and B (viz-meta-ish accent); conflicts in `bad`, retries/success in `good`.

## 4. What does the learner do?

| #   | Step                                 | Interaction                                                                                        | Gate   |
| --- | ------------------------------------ | -------------------------------------------------------------------------------------------------- | ------ |
| 1   | One transfer, four promises          | Pick A/C/I/D, flip "without / with the promise" and watch balances and the total-money meter       |        |
| 2   | Keeping promises without a server ⭐ | **Scroll story**: A, C, I, D on object storage, then "who referees the commit?"                    |        |
| 3   | Conflict lab ⭐                      | **Simulation**: choose two concurrent operations + isolation level, step through detection & retry |        |
| 4   | Checkpoint                           | Predict the outcome of a concurrent pair                                                           | choice |
| 5   | Isolation levels                     | Timeline of a write-skew-style anomaly under the weaker level vs the stronger one                  |        |
| 6   | Designing for fewer conflicts        | Partition-scoped predicates, row-level concurrency, retries                                        |        |
| 7   | Who referees the commit?             | Pick a storage + format; see which primitive makes the commit atomic and what to configure         |        |
| 8   | Checkpoint                           | Match failures to the promise that prevents them                                                   | sort   |
| 9   | Takeaways                            |                                                                                                    |        |
