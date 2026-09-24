# Storyboard: What "at scale" means

Track: System Design at Scale · Chapter 1 · Module 1 · ~25 min · level: beginner

## What must the learner understand?

1. Growth exposes bottlenecks one at a time; architecture grows to fix each (separate DB → load balancer + app servers → cache + replicas → CDN + queue → shards + regions).
2. Scaling up is simple but has a ceiling and a single point of failure; scaling out needs stateless servers and a load balancer.
3. Scale means traffic, data and people.
4. Measure before adding architecture.

## Steps

| #   | Step                             | Interaction                                                                               | Gate   |
| --- | -------------------------------- | ----------------------------------------------------------------------------------------- | ------ |
| 1   | From 100 users to 100 million ⭐ | **Scroll story** (home kitchen → restaurant chain): diagram grows, "what broke" per stage |        |
| 2   | Up or out? ⭐                    | **Simulation**: traffic slider × strategy; ceiling, failure, code impact                  |        |
| 3   | What comes next?                 | Order the typical growth steps                                                            | order  |
| 4   | Three kinds of scale             | Sort symptoms: traffic, data, people                                                      | sort   |
| 5   | Measure before you shard         | DB at 95% CPU with 5,000 users                                                            | choice |
| 6   | What to remember                 |                                                                                           |        |
