# Checkpoints and exactly-once processing (Streaming Data Systems, module 15)

1. **Photographs of the tally** (analogy): a bell passed with the ballots; each counter photographs at the bell; restore and recount after a power cut.
2. **Crash, restore, replay** ⭐ (simulation): 20 payments, checkpoints after 5 and 10, crash after 13; state + positions saved together vs offsets committed separately vs offset only; plain vs transactional sink; job count vs truth vs repeated results downstream.
3. **Barriers and snapshots** (explore): ABS paper, alignment, unaligned checkpoints, incremental/changelog (benchmark), checkpoints vs savepoints, defaults.
4. **Exactly once to the outside** (explore): two-phase commit, Kafka sink EXACTLY_ONCE, timeout trap, open transactions, Kafka Streams/Spark/Dataflow.
5. **Correct, duplicated or lost?** (sort checkpoint).
6. **Wrap**.
