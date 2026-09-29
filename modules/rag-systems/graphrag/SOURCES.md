# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m15-facts.md`.

- Edge et al., "From Local to Global: A GraphRAG Approach to Query-Focused Summarization" (arXiv:2404.16130, v1 Apr 2024, v2 Feb 2025; preprint): podcast (~1M tokens) and news (~1.7M) collections; GPT-4-judged comprehensiveness win rates 72–83% vs plain RAG; plain RAG most direct; community detection with Leiden; map-reduce over community summaries.
- Microsoft graphrag (MIT; v3.2.0, maintenance mode since Aug 2026): "GraphRAG indexing can be an expensive operation … start small." FastGraphRAG indexing method; LazyGraphRAG (Microsoft Research blog, Nov 2024; not in the package).
- Han et al., "RAG vs. GraphRAG: A Systematic Evaluation" (arXiv 2502.11371): RAG better on single-hop, graphs on multi-hop; about a third of answer entities missing from extracted graphs. GraphRAG-Bench (ICLR 2026). Zeng et al. (arXiv 2506.06331): LLM-judge position and length bias shrinks reported GraphRAG/LightRAG wins.
- Traag, Waltman & van Eck, "From Louvain to Leiden" (Scientific Reports 9:5233, 2019). Blondel et al. (Louvain, 2008).
- HippoRAG (NeurIPS 2024), LightRAG (Guo et al., 2024; authors' own judged win rates).
- Ecosystem: neo4j-graphrag (Apache-2.0), LlamaIndex PropertyGraphIndex, LangChain LLMGraphTransformer (now langchain-neo4j), Amazon Bedrock Knowledge Bases GraphRAG with Neptune Analytics (GA March 2025), Google Spanner Graph reference design. Cloud versions expand vector search along graph links; no community reports.
- The complaint notes are made up; extraction, reports and answers are real, unedited Phi-4-mini output.
