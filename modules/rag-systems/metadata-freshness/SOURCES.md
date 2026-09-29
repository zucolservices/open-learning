# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m05-facts.md`.

- pgvector README: "If a condition matches 10% of rows, with HNSW and the default hnsw.ef_search of 40, only 4 rows will match on average"; iterative index scans since 0.8.0. OpenSearch: post-filtering "may return significantly fewer than k results". Weaviate pre-filtering (ACORN default since v1.34).
- Amazon Bedrock Knowledge Bases: incremental sync (added, modified, deleted files) that you must run after changes; `<file>.metadata.json` sidecars for metadata filtering.
- Azure AI Search: OData $filter; preFilter default, postFilter, strictPostFilter (preview); indexers don't track deletions without a deletion-detection policy.
- OpenAI vector stores: file attributes (up to 16 keys) with eq/ne/gt/gte/lt/lte/in/nin filters; removing a file from a vector store doesn't delete the file.
- Google RAG Engine on Gemini Enterprise Agent Platform: metadata_filter (CEL), Preview.
- LangChain Indexing API (langchain_core.indexing): cleanup None / incremental / full / scoped_full. LlamaIndex IngestionPipeline: UPSERTS, DUPLICATES_ONLY, UPSERTS_AND_DELETE. Pinecone: `doc#chunkN` IDs, delete then insert.
- Digital Personal Data Protection Act 2023, s.12 (erasure) and s.8(7); DPDP Rules 2025 (G.S.R. 846(E), notified 13/14 November 2025): these duties apply from May 2027.
- Morris et al., "Text Embeddings Reveal (Almost) As Much As Text" (EMNLP 2023): 92% of 32-token inputs recovered exactly. OWASP Top 10 for LLM Applications 2025, LLM08.
- The circulars, dates and fines are made up. Retrieval and answers are real model output.
