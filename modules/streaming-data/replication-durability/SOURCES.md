# Sources (fact-checked 2026-10-02, before building)

Full notes: scratchpad `streaming/m05-facts.md`.

- Kafka 4.3 Design > Replication: one leader, zero or more followers per partition; "A message is considered committed only when all replicas in the in-sync replicas (ISR) for that partition have applied it to their log"; replica.lag.time.max.ms 30000; consumers see only committed messages; since 3.7 the high watermark doesn't advance while ISR < min.insync.replicas. fsync on every write "can reduce performance by two to three orders of magnitude"; "We recommend using the default flush settings which disable application fsync entirely."
- Producer acks 0 / 1 / all; default all since 3.0 (KIP-679). min.insync.replicas default 1; NotEnoughReplicas when the ISR is too small; recommended RF 3, min.insync.replicas 2, acks=all. default.replication.factor 1.
- unclean.leader.election.enable default false since 0.11.0.0 ("What if they all die?"). Eligible Leader Replicas (KIP-966): opt-in in 4.0, default for new clusters in 4.1.
- KRaft-only since 4.0; 3 or 5 controllers. broker.rack; follower fetching (KIP-392). Amazon MSK: 2 or 3 AZs, recommend 3 AZs, RF ≥ 3, minISR ≤ RF−1; MSK default unclean.leader.election.enable true without tiered storage.
- Jepsen: Kafka 0.8 beta (24 Sep 2013) — with request.required.acks=-1, 520 of 987 acknowledged writes lost after the ISR shrank to the leader; Redpanda 21.10.1 (29 Apr 2022) — ten issues incl. data loss on process pauses; NATS 2.12.1 (8 Dec 2025) — committed writes lost partly due to two-minute flush interval.
- Redpanda: Raft per partition, acks=all fsynced on a majority by default. BookKeeper E ≥ Qw ≥ Qa, tolerates Qa−1 failures. Kinesis: synchronously replicates across three AZs. Pub/Sub: synchronous to at least two zones, best-effort third. Event Hubs: automatic zone redundancy across three AZs.
- The m5 crash scenario is a simplified model of Kafka's rules: the leader crashes before followers fetch unless acks=all waited for the ISR.
