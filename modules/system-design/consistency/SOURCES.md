# Sources: Consistency, CAP & quorums

Fact-checked 2026-09-24. Pages saved in the session scratchpad (`sd-data/`).

| Claim in the module                                                                                                                                         | Verdict                                     | Source                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| CAP (Gilbert & Lynch): linearizability vs availability of every non-failing node during a partition; "2 of 3" misleading (Brewer 2012); PACELC (Abadi 2012) | Verified                                    | Kleppmann 2015 "Please stop calling databases CP or AP"; InfoQ Brewer 2012; Abadi PACELC paper |
| Linearizable ⊃ sequential ⊃ causal ⊃ eventual; read-your-writes is a session guarantee                                                                      | Verified                                    | Terry 1994; Kleppmann 2015                                                                     |
| R + W > N (Dynamo); sloppy quorums and hinted handoff; Cassandra QUORUM/LOCAL_QUORUM/ANY                                                                    | Verified                                    | Dynamo 2007; Cassandra architecture docs                                                       |
| DynamoDB strong reads cost 2× RCU; GSIs eventually consistent; not CP/AP as a whole                                                                         | Verified                                    | DynamoDB developer guide                                                                       |
| Jepsen: Cassandra lost 28% of acknowledged writes (LWW, ms timestamps)                                                                                      | Verified                                    | aphyr.com/posts/294-call-me-maybe-cassandra                                                    |
| Vector clocks (Dynamo); CRDTs (Shapiro et al. 2011)                                                                                                         | Verified (CRDT paper cited, not downloaded) | Dynamo 2007; INRIA RR-7687                                                                     |
| Spanner external consistency with TrueTime, serializable default, repeatable read available; CockroachDB SERIALIZABLE default, READ COMMITTED available     | Verified                                    | cloud.google.com Spanner TrueTime docs; cockroachlabs.com transactions                         |

## Decisions

- Wallet balances, timestamps and cart items are illustrative; the quorum view shows the worst-case read set.
