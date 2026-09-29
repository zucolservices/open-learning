# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m02-facts.md`.

- intfloat/multilingual-e5-small model card: 384 dimensions, 12 layers, about 118M parameters, 512-token input, MIT licence, "query: " / "passage: " prefixes; initialised from Multilingual-MiniLM, 100 languages. Wang et al., "Multilingual E5 Text Embeddings: A Technical Report" (arXiv 2402.05672, 2024). ONNX port: Xenova/multilingual-e5-small.
- Qwen2.5-1.5B-Instruct model card: 1.54B parameters, Apache-2.0, 32,768-token context. ONNX port: onnx-community/Qwen2.5-1.5B-Instruct.
- Transformers.js v4 (v4.0.0, 30 March 2026): ONNX Runtime on CPU (WASM) or GPU (WebGPU).
- Names for the two halves: LangChain RAG tutorial (indexing; retrieval and generation), LlamaIndex (ingestion pipeline, query engine), Haystack (indexing and query pipelines).
- Top-k defaults in source: LlamaIndex DEFAULT_SIMILARITY_TOP_K = 2; LangChain k = 4.
- Karpukhin et al., DPR (EMNLP 2020): dual encoders with dot-product scoring; "cosine is equivalent to inner product for unit vectors".
- The corpus (Kalpanagar Municipal Corporation) is invented: every rule, date and fee is made up. All answers and scores are real model output, unedited.
