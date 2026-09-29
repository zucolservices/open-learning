# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m09-facts.md`.

- Cormack, Clarke & Büttcher, "Reciprocal Rank Fusion outperforms Condorcet and individual Rank Learning Methods" (SIGIR 2009): RRF = Σ 1/(k + r); "k = 60 was fixed during a pilot investigation and not altered during subsequent validation". It fused TREC runs, not BM25 with vectors.
- Bruch, Gai & Ingber, "An Analysis of Fusion Functions for Hybrid Retrieval" (ACM TOIS 42(1), 2023): RRF "sensitive to its parameters"; a tuned convex combination beat RRF; hybrid beat both single methods on most, not all, datasets.
- Elasticsearch rrf retriever (rank constant 60, window 10; weighted RRF GA 9.2; Enterprise licence on self-managed) and linear retriever. OpenSearch hybrid query (2.11+, min_max default) and RRF processor (2.19, k 60). Weaviate hybrid (alpha 0.75; relativeScoreFusion default since 1.24; ranked fusion 1/(rank + 60)). Qdrant Query API (RRF default k = 2, ranks from 0; DBSF). Azure AI Search (RRF, k not configurable). pgvector README hybrid example (RRF k 60 in SQL; ts_rank_cd, not BM25). Google Vector Search (RRF, rrf_ranking_alpha). Amazon Bedrock HYBRID search (fusion undocumented).
- Anthropic, "Introducing Contextual Retrieval" (19 September 2024): exact-match example "Error code TS-999"; adding BM25 to embeddings cut failures from 3.7% to 2.9% (vendor blog).
- Formal et al., SPLADE (SIGIR 2021); Chen et al., BGE-M3 (2024) sparse output.
- Passages, queries and codes are made up. Rankings are computed live from our BM25 and real multilingual-e5-small vectors.
