# Consumer groups and offsets (Streaming Data Systems, module 4)

1. **Cooks and order rails** (analogy): six rails shared by cooks, one cook per rail, a ticket clip per rail; a seventh cook idles.
2. **Share the work** ⭐ (live simulation): six partitions, consumers ±, events per partition slider; range-style assignment; lag per partition and total lag chart; eager vs cooperative rebalance pauses; uneven splits and idle consumers; effective capacity.
3. **Bookmarks: committed offsets** ⭐ (step-through): commit after processing → crash → duplicates; commit before processing → crash → loss; __consumer_offsets, auto.offset.reset.
4. **Rebalancing, gently** (explore): eager, cooperative, KIP-848 (opt-in), static membership, share groups, other platforms.
5. **What happens?** (sort checkpoint).
6. **Wrap**.
