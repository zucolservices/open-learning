# Hybrid search & fusion: storyboard

1. **Two search parties** (analogy): a reader of exact labels, someone who understands descriptions, and merging their shortlists.
2. **The fusion lab** ⭐ (live): 32 made-up passages (`corpus.ts`: help pages, 2026 water rules, circulars, form codes). Eight queries (codes, numbers, paraphrases, Hindi). Keyword top 5 (BM25 live via `../bm25/bm25`), vector top 5 (precomputed e5 vectors in `vectors.json`, dot product live) and hybrid top 5 (`fusion.ts`: weighted RRF with k, or min–max weighted scores); the right passage highlighted with its rank in each list; the RRF arithmetic for it.
3. **Scoreboard** (live): hits at 1 and in top 3 for keyword, vector and hybrid across all eight, with the rank grid; fusion method and weight controls.
4. **Do the maths** (choice): 1st + 5th vs 2nd + 2nd at k = 60.
5. **Hybrid everywhere**: vendor support and defaults (September 2026); learned sparse retrieval.
6. **What to remember**.
