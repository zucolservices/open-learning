# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m12-facts.md`.

- Anthropic, "Introducing Contextual Retrieval" (engineering blog, 19 Sept 2024): the prompt (verbatim), context "usually 50-100 tokens" prepended before embedding and before BM25; 1 − recall@20 falls 5.7% → 3.7% (−35%), → 2.9% with contextual BM25 (−49%, which also adds BM25), → 1.9% with reranking (−67%); $1.02 per million document tokens is a 2024 estimate (consistent with Claude 3 Haiku prices plus caching; the sentence names no model). Generic document summaries gave "very limited gains".
- Anthropic prompt-caching docs (read 2026-09-29): cache reads 0.1× base input price, with per-model exceptions (so "about a tenth on most Claude models").
- Merola & Singh, "Reconstructing Context" (arXiv:2504.19754, ECIR 2025 workshop): contextual retrieval NDCG@5 0.317 vs late chunking 0.309 on a small subset; contextual costs more. No independent replication of Anthropic's percentages found.
- Günther et al., "Late Chunking" (arXiv:2409.04701, Jina AI, 2024).
- LlamaIndex: metadata included in embedded text by default; `SentenceWindowNodeParser` (window_size 3), `AutoMergingRetriever`; production-RAG guide ("decouple chunks used for retrieval with those that are used for synthesis").
- LangChain `ParentDocumentRetriever` (now in `langchain_classic`). Amazon Bedrock Knowledge Bases hierarchical chunking. Azure Architecture Center, "RAG chunk enrichment phase" (cost warning).
- The rules are made up; notes, rankings and answers are real, unedited model output.
