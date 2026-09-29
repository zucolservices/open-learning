# Reranking & relevance filtering: storyboard

1. **Two rounds of selection** (analogy): screen CVs, interview a shortlist, offer only to those who pass; bi-encoder retrieval, cross-encoder reranking, relevance filter.
2. **Rerank the shortlist** ⭐ (real models): six questions over the 32 hybrid-module passages; first-stage top 10 from multilingual-e5-small; rescored by ms-marco-MiniLM-L6 (English), bge-reranker-v2-m3 (multilingual) and Phi-4-mini asked Yes/No (probability of "Yes"). Rank moves, confidence bars, right passage highlighted. Jev note from `rag/jev-facts.md`.
3. **Keep only what helps** ⭐ (real scores): threshold slider per judge; passages kept of 60 and questions whose right passage survived; the "three months vs 90 days" question loses its answer at high thresholds; the English model zeroes the Hindi question.
4. **When nothing passes** (choice): retry, then admit, never guess.
5. **Rerankers to know** (cards, September 2026).
6. **What to remember**.

Data: `data.json` from `scratchpad/rag/embed/r10.mjs` (Transformers.js v4; cross-encoder logits through a sigmoid; Phi-4-mini q4f16 next-token logits for "Yes" vs "No").
