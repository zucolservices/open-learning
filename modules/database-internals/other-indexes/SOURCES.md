# Sources: Hash, inverted and vector indexes (fact-checked 2026-10-04)

- PostgreSQL 18 docs, Index Types (B-tree, Hash "can only handle simple equality comparisons", GiST, SP-GiST, GIN, BRIN, plus the bloom extension); GIN; BRIN ("very large tables"); Text search indexes.
- PostGIS docs: "PostGIS uses an R-Tree index implemented on top of GiST to index spatial data."
- MySQL 8.4 manual: "InnoDB full-text indexes have an inverted index design."
- Elasticsearch: The Definitive Guide (inverted index definition).
- Oracle Database Concepts 19c: bitmap indexes.
- pgvector README (0.8.7, 2026-10-01): exact search with "perfect recall"; approximate indexes trade "some recall for speed"; HNSW and IVFFlat.
- Malkov & Yashunin, "Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs", arXiv 2016.

The reviews, buckets, block ranges and vectors are illustrative.
