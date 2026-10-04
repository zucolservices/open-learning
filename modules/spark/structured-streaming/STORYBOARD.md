# Storyboard: Structured Streaming

1. **A ledger that never closes** (story): add only the new lines.
2. **Micro-batches and watermarks** ⭐ (simulation): four micro-batches; input table, state store, watermark, final output; late events kept or dropped.
3. **Triggers and modes** (explore): default, processingTime, availableNow, continuous, real-time mode.
4. **Checkpoints and state** (explore): checkpoint location, crash and restart, RocksDB, transformWithState.
5. **Which trigger?** (checkpoint `which-trigger`).
6. **What to remember** (wrap).
