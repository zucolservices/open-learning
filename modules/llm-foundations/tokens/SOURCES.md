# Sources (fact-checked 2026-09-25)

- P. Gage, "A New Algorithm for Data Compression", C Users Journal (Feb 1994); Sennrich, Haddow & Birch, "Neural Machine Translation of Rare Words with Subword Units", ACL 2016 (arXiv 1508.07909) — BPE and the low/lower/newest/widest example.
- OpenAI tiktoken (`openai_public.py`, `model.py`): GPT-2 r50k_base 50,257; cl100k_base (GPT-3.5/4) ~100k; o200k_base (GPT-4o, 4.1, o-series, GPT-5 family) ~200k; o200k_harmony for gpt-oss.
- Tokenizer in the browser: `gpt-tokenizer` 4.0.0 (MIT), per-encoding imports.
- Vocabulary sizes from Hugging Face configs: Llama 3 128,256; Gemma 3 262,144; Mistral Tekken 131,072; Qwen3 151,936; DeepSeek-V3 129,280.
- A. Petrov et al., "Language Model Tokenizers Introduce Unfairness Between Languages", NeurIPS 2023 (arXiv 2305.15425): up to 15× differences; cl100k premiums on FLORES-200 (Hindi 4.79×, Kannada 8.90×).
- o200k premiums (Hindi 1.57×, Bengali 1.70×, Tamil 1.98×, Telugu 1.93×, Kannada 1.97×) and cl100k values shown were measured for this module on FLORES-200 devtest (1,012 sentences) with the real tokenizers; the cl100k Hindi result (4.77×) reproduces Petrov et al.'s 4.79×.
- Rule of thumb ~4 characters or ~¾ word per English token: OpenAI Help Center.
- Anthropic docs: newer Claude tokenizer produces more tokens per word than earlier ones.
