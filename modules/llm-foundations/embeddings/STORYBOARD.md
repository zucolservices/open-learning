# Embeddings: meaning as coordinates: storyboard

1. **A map of meaning** ⭐ (3D model, `word-map.tsx`). Map analogy. 38 real word embeddings in six groups, PCA-projected to 3D, auto-rotating (drag to orbit). Click a point or a preset word: nearest neighbours by cosine similarity over all 384 dimensions (dashed lines in 3D, bars below), plus the least similar word. "chai" lands near names, flagged for the checkpoint.
2. **Search by meaning** ⭐ Six customer questions vs 16 FAQ entries: keyword overlap vs embedding similarity (Bangalore → Bengaluru, money back → refunds).
3. **Measuring closeness**: two arrows and an angle slider; cosine similarity from 1 to −1.
4. **King − man + woman**: vector arithmetic on real embeddings for three analogies, with and without excluding the input words (Nissim et al. caveat).
5. **Why did it miss?** (choice): embeddings reflect their training data (chai vs tea 0.31).
6. **Embedding models you'll meet**: OpenAI, Google, Cohere, Amazon Titan, BGE-M3, multilingual-e5, Qwen3-Embedding, EmbeddingGemma, all-MiniLM-L6-v2; MTEB; vectors don't mix across models.
7. **What to remember**.
