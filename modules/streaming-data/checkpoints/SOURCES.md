# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `streaming/m15-facts.md`.

- Carbone, Fóra, Ewen, Haridi, Tzoumas, "Lightweight Asynchronous Snapshots for Distributed Dataflows" (arXiv:1506.08603, 29 Jun 2015): Asynchronous Barrier Snapshotting. Flink docs: "inspired by the standard Chandy-Lamport algorithm"; "Barriers never overtake records, they flow strictly in line"; EXACTLY_ONCE (aligned) default; at-least-once mode can duplicate on restore; checkpointing off unless enabled; defaults timeout 10 min, 1 concurrent, 0 tolerable failures; checkpoint storage jobmanager (default) or filesystem; incremental checkpoints (RocksDB, opt-in); changelog backend (FLIP-158; 1.15, production-ready 1.16, opt-in) — benchmark median checkpoint 5 s → 311 ms; unaligned checkpoints (Beta 1.11); savepoints vs checkpoints.
- Recovery: restore latest completed checkpoint, rewind sources; Kafka source "does NOT rely on committed offsets for fault tolerance".
- Nowojski & Winters, "An Overview of End-to-End Exactly-Once Processing in Apache Flink" (28 Feb 2018): TwoPhaseCommitSinkFunction (Flink 1.4); removed in 2.0 with the old sink API (SupportsCommitter in the new API). Kafka sink EXACTLY_ONCE "delays record visibility effectively until a checkpoint is written"; transaction.timeout.ms ≫ max checkpoint duration + max restart duration; sink default 1 h vs broker transaction.max.timeout.ms 15 min; open transactions block read_committed readers. KIP-939 transaction.two.phase.commit.enable (Kafka 4.x).
- Kafka Streams: commit.interval.ms 100 ms under exactly-once, 30000 ms otherwise; exactly_once_v2 enables read_committed and idempotence; changelog restore.
- Spark 4.2: offsets WAL and commits log; versioned state store; "replayable sources and idempotent sinks … end-to-end exactly-once semantics"; Kafka sink at-least-once.
- Dataflow: "Streaming pipelines use exactly-once processing by default"; at-least-once mode GA 27 Feb 2024. Amazon Managed Service for Apache Flink default checkpoint interval 60 s.
- The 20-payment crash scenario is a simplified model; the checkpoint-timeout restart loop is reasoning from the documented defaults.
