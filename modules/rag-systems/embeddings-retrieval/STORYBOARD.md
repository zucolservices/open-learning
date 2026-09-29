# Embeddings for retrieval: storyboard

1. **Meaning, not words** (analogy): three ways of asking about dry-waste days (English paraphrase, Hindi, the passage's own words) all land near the passage; dense retrieval.
2. **Three ways to ask** ⭐ (sandbox, real results): four questions × English / Hindi / romanised Hindi against the 15 English Kalpanagar passages, ranked by four real models (all-MiniLM-L6-v2, paraphrase-multilingual-MiniLM-L12-v2, multilingual-e5-small, bge-m3). Rank chips per model, the chosen model's top 3 with scores, and a rank grid for all 12 queries.
3. **Scores are relative** (real data): each model's range of top-3 similarity scores across the 12 queries; no thresholds across models.
4. **Choosing a model** (cards): open and API models with verified dimensions, input limits and licences (September 2026); MTEB for shortlisting; same model for queries and passages; Matryoshka.
5. **What would you do?** (choice): romanised Hindi citizens, English pages: test candidates on real questions.
6. **What to remember**.

Data: `data.json` from `scratchpad/rag/embed/r07.mjs` (Transformers.js v4; MiniLM and paraphrase models mean-pooled; e5 with query/passage prefixes; Xenova/bge-m3 q8, CLS pooling; all normalised; passages embedded as "title. text").
