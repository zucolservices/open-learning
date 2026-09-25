# Positions & the context window: storyboard

1. **Dog bites man** ⭐ Without position information both sentences are the same bag of tokens; with it they differ. RoPE-style rotation dial: the angle between two tokens depends only on their distance.
2. **Stretch the window** ⭐ (simulation). Context 1,000 → 1,000,000 tokens (log slider) with word-count equivalents; attention design: every head keeps keys (MHA, 32 KV heads), shared keys (GQA, 8), compressed (MLA-style, illustrative 93% below GQA). Llama 3.1 8B fp16: KV cache per token and total, weights + cache vs an 80 GB GPU, token pairs compared. Beyond 128k flagged as hypothetical for Llama 3.1 8B.
3. **Size the cache** (predict): 131,072 × 128 KiB = 16 GiB.
4. **Double the context** (choice): attention pairs grow with the square of length.
5. **How big are windows now?**: GPT-2 1,024 → ChatGPT ~4k → Llama 3.1 128k → Claude Haiku 4.5 200k → 1M for Claude Opus 5.5/Sonnet 5, Gemini 3.x, GPT-6, DeepSeek V4.
6. **What to remember**.
