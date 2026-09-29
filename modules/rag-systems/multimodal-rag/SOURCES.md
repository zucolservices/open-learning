# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m17-facts.md`.

- Faysse et al., "ColPali: Efficient Document Retrieval with Vision Language Models" (ICLR 2025): ViDoRe V1 nDCG@5 81.3 vs 65.1–67.0 for text pipelines (best: Unstructured + Claude-3-Sonnet captions + BGE-M3); indexing 0.39 s vs 7.22 s per page (NVIDIA L4); ~1,030 × 128-dim vectors (257.5 KB) per page; token pooling and binarisation. ColPali weights on PaliGemma (Gemma terms); ColQwen2 Apache-2.0. `colpali-engine` deprecated (Aug 2026) in favour of Sentence Transformers v6 multi-vector encoders.
- ViDoRe V3 (Jan 2026): visual retrievers 59.8 vs text 51.0 nDCG@10 alone, but text retriever + reranker best overall (63.6 vs 57.8). arXiv:2604.18508: page images suboptimal for scientific papers.
- Khattab & Zaharia, ColBERT (SIGIR 2020): late interaction.
- CharXiv (2024): GPT-4o 47.1% vs humans 80.5% on chart reasoning; ChartQA saturated.
- Models used: SmolVLM-500M-Instruct (Apache-2.0), Qwen2-VL-2B-Instruct (Apache-2.0), Phi-4-mini, multilingual-e5-small; Tesseract OCR.
- Managed and embeddings: Azure AI Search image verbalization vs multimodal embeddings; Amazon Bedrock Knowledge Bases parsing (default, Data Automation, foundation model); Google Agent Search layout parser; Cohere embed-v4.0, voyage-multimodal-3.5, gemini-embedding-2 (GA Apr 2026), Amazon Nova multimodal embeddings.
- The report pages are made up; OCR, descriptions and answers are real, unedited output. The patch grid in step 5 is an illustration.
