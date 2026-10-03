# Storyboard: MVCC

1. **Many versions** (scroll story): noticeboard analogy; versions; snapshots; cleanup; in-table vs undo designs.
2. **Read while someone writes** ⭐ (step-through): xmin/xmax across six frames, ending in VACUUM.
3. **Cleaning up** (explore): bloat, long transactions, XID wraparound, autovacuum.
4. **HOT updates** (explore): ordinary vs heap-only tuple updates.
5. **Old versions elsewhere** (compare): PostgreSQL, InnoDB, Oracle.
6. **The growing table** (checkpoint `growing-table`).
7. **What to remember** (wrap).
