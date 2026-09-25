# Sources (fact-checked 2026-09-25)

- `data.json` was generated offline with Transformers.js (`@huggingface/transformers` v4) running `Xenova/all-MiniLM-L6-v2` (384 dimensions, mean pooling, L2-normalised), then projected to 3D by PCA (power iteration) for the map only. Similarities in the lesson use the full vectors. Results quoted (e.g. king~queen 0.68, chai~tea 0.31, Bangalore query → Bengaluru FAQ 0.74) come from those vectors.
- Mikolov et al., "Efficient Estimation of Word Representations in Vector Space" (arXiv 1301.3781, 2013); Mikolov, Yih & Zweig, "Linguistic Regularities in Continuous Space Word Representations", NAACL 2013 (king − man + woman).
- Nissim, van Noord & van der Goot, "Fair is Better than Sensational: Man is to Doctor as Woman is to Doctor", Computational Linguistics 2020 (arXiv 1905.09866): analogy results depend on excluding input words.
- Embedding models: OpenAI text-embedding-3-small/large (1,536/3,072, shortenable); Google gemini-embedding-001 (3,072, MRL) and gemini-embedding-2 (multimodal, GA Apr 2026); Cohere embed-v4.0 (1,536 default; 256/512/1,024); Amazon Titan Text Embeddings V2 (1,024/512/256); BGE-M3 (1,024); multilingual-e5-large (1,024); Qwen3-Embedding 0.6B/4B/8B (1,024/2,560/4,096); EmbeddingGemma (308M, 768, Sep 2025); all-MiniLM-L6-v2 (384).
- Muennighoff et al., "MTEB: Massive Text Embedding Benchmark" (arXiv 2210.07316).
- Cosine similarity: cos θ = a·b / (‖a‖‖b‖).
