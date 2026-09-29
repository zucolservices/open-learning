# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m07-facts.md`.

- Model cards: sentence-transformers/all-MiniLM-L6-v2 (384 dims, 256 word pieces, English, Apache-2.0; vocabulary lacks most Devanagari vowel signs, checked locally); paraphrase-multilingual-MiniLM-L12-v2 (384 dims, 128 tokens, 50+ languages, paraphrase model); intfloat/multilingual-e5-small (scores "distribute around 0.7 to 1.0"; "what matters is the relative order"); BAAI/bge-m3 (Chen et al., Findings of ACL 2024: 100+ languages, 8,192 tokens, dense + sparse + multi-vector, 1024 dims, MIT).
- MTEB (Muennighoff et al., 2023); MMTEB including MTEB(Indic) (Enevoldsen et al., ICLR 2025). Hindi-BEIR (arXiv 2408.09437).
- Vendor docs (September 2026): OpenAI text-embedding-3 (1536/3072 dims, 8,192 tokens, $0.02/$0.13 per million tokens, `dimensions` parameter); Cohere Embed v4 (256–1536 dims, 128k context, multimodal); Google gemini-embedding-001 (3072 dims, 2,048 tokens, GA July 2025) and Gemini Embedding 2 (GA April 2026, 8,192 tokens); Voyage 4 (January 2026, 32k context); Amazon Titan Text Embeddings V2 (1024/512/256 dims, 8,192 tokens, English-optimised, 100+ languages in preview).
- Kusupati et al., "Matryoshka Representation Learning" (NeurIPS 2022).
- Romanised Hindi: no published benchmark found for these models; "Lost in Transliteration" (SIGIR 2025) shows large drops for transliterated queries in other languages. The sandbox shows the effect on our own queries only.
- Queries, translations and passages are ours; the passages are the made-up Kalpanagar pages. Rankings and scores are real.
