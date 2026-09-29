# A RAG system, end to end: storyboard

1. **Two halves** (analogy + infographic): a librarian catalogues ahead of time and fetches pages at question time; ingestion lane (parse, chunk, embed, index) and query lane (retrieve, assemble, generate); framework names for the halves.
2. **Before any question** ⭐ (step-through, real data): six made-up Kalpanagar help pages (shared corpus in `../_shared/corpus.ts`) → 15 paragraph chunks → a real multilingual-e5-small vector (first 8 of 384 numbers) → all chunks on a 2D map (PCA of the real embeddings), clustered by topic.
3. **Every question** ⭐ (real run): four questions (property tax, water connection, dry waste, passport). The question on the map with lines to its top 3; top-5 list with real cosine scores; the prompt; Qwen2.5-1.5B-Instruct's real answer with citation chips; optional closed-book answer from the same model. Lessons: scores bunch up (the passport question's best match scores close to real answers), citations can be wrong ([2] for a fact in [1]), closed book invents.
4. **Put it in order** (order checkpoint): seven stages from parsing to generation.
5. **What to remember**.

Data: `data.json` from `scratchpad/rag/embed/r02.mjs` (Transformers.js v4; Xenova/multilingual-e5-small with "query: "/"passage: " prefixes, mean pooling, normalised; onnx-community/Qwen2.5-1.5B-Instruct fp16, greedy, max 120 new tokens; PCA by power iteration).
