# Storyboard: Caching patterns

Track: System Design at Scale · Chapter 3 · Module 7 · ~25 min · level: core

## Steps

| #   | Step                         | Interaction                                                                             | Gate   |
| --- | ---------------------------- | --------------------------------------------------------------------------------------- | ------ |
| 1   | Caches everywhere            | Kitchen analogy; five cache layers, click where the request hits                        |        |
| 2   | Four ways to keep a cache ⭐ | **Step-through**: cache-aside, read-through, write-through, write-back (with the crash) |        |
| 3   | Which pattern is it?         | Sort four descriptions                                                                  | sort   |
| 4   | The stale-read race ⭐       | **Fix the problem**: delete / update / delete+TTL / delete+lease                        |        |
| 5   | Update or delete?            | Write the DB, then delete; TTL as safety net                                            | choice |
| 6   | What to remember             |                                                                                         |        |
