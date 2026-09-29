# Evaluating retrieval: storyboard

1. **Write the exam first** (analogy): a teacher compares marks on the same exam, not feelings.
2. **Build the answer key** ⭐ (build, interactive): 12 resident questions over the 32 passages from module 9, with our graded labels (2 answers, 1 helps). Tap to change any label (saved per question, resettable); every later score uses the learner's labels.
3. **Score one question** ⭐ (simulation, real rankings): pick a question, setup and k (1–10); the ranked list with grades and per-position gains; recall@k, precision@k, reciprocal rank and nDCG@k worked out (linear gain, log2(i+1) discount, ideal from all labelled passages).
4. **Compare four setups** ⭐ (comparison, real rankings): keyword (BM25, this track's engine), vector (multilingual-e5-small), hybrid (RRF k = 60) and hybrid + bge-reranker-v2-m3 (q8) reordering the top 10. Averages of five metrics, and per-question nDCG bars. With our labels at k = 10: nDCG keyword 0.81, vector 0.93, hybrid 0.93, reranker 0.95; hit rate 1.0 for all; vector and reranker differ on three questions.
5. **Ways to fool yourself** (cards): size and significance, synthetic questions, unjudged passages, benchmarks.
6. **Ship it?** (choice): grow the test set where systems differ, test significance, weigh cost.
7. **What to remember**.

Data: `scratchpad/rag/r18/golden.json` (questions and labels, written by us), `embed/r18.mjs` (e5 vector ranking, reranker scores for all 32 passages), BM25 and fusion via tsx with `modules/rag-systems/bm25/bm25.ts`. Keyword search only returns passages sharing a word with the question, so its list can be shorter than k.
