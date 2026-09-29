# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m08-facts.md`.

- Malkov & Yashunin, "Efficient and robust approximate nearest neighbor search using Hierarchical Navigable Small World graphs", IEEE TPAMI 42(4), 2020 (arXiv 2016): layered graph, greedy descent, exponentially decaying level probability, parameters M, efConstruction, ef.
- pgvector README (0.8.6, July 2026): exact search by default ("perfect recall"); HNSW m = 16, ef_construction = 64, hnsw.ef_search = 40; IVFFlat probes 1, lists rows/1000 up to 1M rows.
- Johnson, Douze & Jégou, "Billion-scale similarity search with GPUs" (IEEE Trans. Big Data, 2021); Douze et al., "The Faiss library" (2024; IEEE Trans. Big Data, 2026). FAISS wiki: HNSW memory about (d × 4 + M × 2 × 4) bytes per vector; direct computation for "only a few searches".
- Jégou, Douze & Schmid, "Product quantization for nearest neighbor search", IEEE TPAMI 33(1), 2011. Qdrant, Weaviate and Elasticsearch docs: int8 4×, binary 32× smaller; re-score extra candidates.
- Subramanya et al., DiskANN (NeurIPS 2019); Guo et al., ScaNN (ICML 2020). OpenSearch: "1.1 * (4 * dimension + 8 * m) bytes/vector".
- Aumüller, Bernhardsson & Faithfull, ANN-Benchmarks (Information Systems 87, 2020): recall definition; queries per second vs recall.
- Benchmark: our measurement, 29 September 2026, FAISS 1.15.1 on an Apple M-series CPU, one thread; data synthetic (2,000 Gaussian clusters, 384 dims, normalised). Real embeddings behave differently; measure on your own.
- The browser HNSW is a teaching simplification (nearest-M links instead of the paper's neighbour-selection heuristic).
