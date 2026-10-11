# Storyboard: Integration tests

1. **Every part passed, the kettle didn't** (story): the bug lives in the join.
2. **Run the same tests against three databases** ⭐ (simulation): in-memory fake, H2 in PostgreSQL mode, PostgreSQL in a container; bugs found, false alarms, suite time; then what production really does.
3. **Keeping integration tests fast and independent** (explore).
4. **Tools for throwaway infrastructure** (explore): Testcontainers, Compose, in-memory imitations, cloud emulators (LocalStack change 2026).
5. **Which test would catch it?** (checkpoint `testing-integration`).
6. **What to remember** (wrap).
