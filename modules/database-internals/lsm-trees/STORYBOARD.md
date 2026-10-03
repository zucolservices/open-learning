# Storyboard: LSM trees

1. **The order pad** (story).
2. **Writes: memtable, flush, compact** ⭐ (simulation): 16 writes incl. updates and deletes.
3. **Reads: newest first** ⭐ (simulation): read path with and without Bloom filters.
4. **Three kinds of amplification** (explore); who uses LSM; MyRocks.
5. **Why reads can be slower** (checkpoint `why-slower`).
6. **What to remember** (wrap).
