# Vector indexes: storyboard

1. **The nearest chai stall** (analogy): highway exit → main road → lane instead of checking every stall; approximate nearest-neighbour search.
2. **Climb the graph** ⭐ (step-through, built live in the browser by `hnsw.ts`): 300 clustered 2D points, three layers (exponential level rule, M = 5 nearest links per layer, two-way). Four questions; step hop by hop from the top entry point down to the layer-0 beam search; ef slider; points compared vs 300; found the true nearest or a near miss (question 4 misses at ef 2–4, finds it at 6).
3. **Speed against recall** ⭐ (real benchmark): FAISS on 100,000 synthetic clustered 384-dim vectors, one core, 300 queries (`bench.json`, script in `scratchpad/rag/ann/bench.py`). HNSW (M 16, efConstruction 64; efSearch 8–512) and IVF (316 lists; nprobe 1–64) recall@10 vs ms per query on a log scale, beside exact search; speed-up; linear extrapolation of exact search.
4. **Where the memory goes** (calculator): vectors × dims × bytes for float32 / int8 / binary, plus FAISS's HNSW link estimate; measured sizes from the benchmark (flat, HNSW, HNSW-int8, IVF-PQ).
5. **Guess the memory** (predict): 10M × 1024 float32 ≈ 41 GB.
6. **What to remember**: pgvector defaults; DiskANN.
