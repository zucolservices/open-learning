# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m10-facts.md` and `rag/jev-facts.md`.

- Reimers & Gurevych, Sentence-BERT (EMNLP 2019): cross-encoders accurate but slow (all-pairs over 10,000 sentences "about 50 million inference computations (~65 hours)" vs about 5 seconds with SBERT). Sentence-Transformers "Retrieve & Re-Rank" (retrieve 100, keep a few).
- Nogueira & Cho, "Passage Re-ranking with BERT" (2019): "outperforming the previous state of the art by 27% (relative) in MRR@10".
- Sun et al., RankGPT (EMNLP 2023): listwise LLM reranking; cost caveat.
- Cohere Rerank docs: scores 0–1; set thresholds on your own queries. Cuconasu et al. (2024): near-miss passages hurt RAG answers. Anthropic Contextual Retrieval (2024): retrieve 150, rerank to 20.
- Reranker details (September 2026): ms-marco-MiniLM-L6-v2 and bge-reranker-v2-m3 (Apache-2.0), mxbai-rerank-v2 and Qwen3-Reranker (Apache-2.0), Jina Reranker v3/v3.5 (CC BY-NC 4.0), Cohere Rerank 4 (32K), Voyage rerank-2.5, Azure semantic ranker (top 50, scores 0–4), Google ranking API in Agent Search (0–1, up to 1,000 records), Amazon Rerank 1.0 on Bedrock.
- TypeSafe Jev and the jev-reranker NanoHotpotQA result (Hugging Face blog, 19 September 2026): community library, not peer-reviewed.
- Questions and passages are made up; all scores are real model output.
