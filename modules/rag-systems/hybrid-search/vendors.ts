/** Hybrid search support, checked in September 2026. Defaults and tiers change; check the docs. */
export const VENDORS: [string, string][] = [
  [
    "Elasticsearch",
    "rrf retriever (rank constant 60, ranks from 1; weighted RRF since 9.2) and a linear retriever with normalised, weighted scores. On self-managed clusters these need an Enterprise licence.",
  ],
  [
    "OpenSearch",
    "Hybrid query with a normalisation processor (min–max by default, weighted mean) since 2.11, and an RRF processor (k = 60) since 2.19.",
  ],
  [
    "Weaviate",
    "Hybrid search with alpha (default 0.75 towards vectors); fusion is min–max “relative score” by default, or ranked fusion with 1/(rank + 60).",
  ],
  [
    "Qdrant",
    "Query API with prefetch, then RRF or DBSF fusion. Its RRF default is k = 2 with ranks from 0, not 60.",
  ],
  [
    "Azure AI Search",
    "Hybrid queries merged with RRF automatically; k isn't user-settable (the docs mention about 60).",
  ],
  [
    "PostgreSQL + pgvector",
    "Combine a vector query and full-text search with RRF in SQL. Postgres full-text ranking (ts_rank) isn't BM25; BM25 needs an extension.",
  ],
  [
    "Google Vector Search / Agent Retrieval",
    "Hybrid search merged with RRF; a ranking alpha sets the dense/sparse balance.",
  ],
  [
    "Amazon Bedrock Knowledge Bases",
    "A HYBRID search type on supported stores; the fusion method isn't documented.",
  ],
];
