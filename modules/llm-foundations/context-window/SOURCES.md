# Sources (fact-checked 2026-09-25)

- Vaswani et al. 2017 (sinusoidal positional encoding); Su et al., "RoFormer: Enhanced Transformer with Rotary Position Embedding" (arXiv 2104.09864, 2021).
- Llama 3 paper (arXiv 2407.21783) and configs: Llama 3.1 8B 32 layers, 8 KV heads, head_dim 128, 131,072 max positions. KV cache per token = 2 × 32 × 8 × 128 × 2 bytes = 128 KiB; 131,072 tokens = 16 GiB; with 32 KV heads 64 GiB.
- Ainslie et al., "GQA" (arXiv 2305.13245, 2023). DeepSeek-V2 (arXiv 2405.04434): multi-head latent attention reduces the KV cache by 93.3% versus DeepSeek 67B (its predecessor). Dao et al., FlashAttention (arXiv 2205.14135): exact, IO-aware, memory linear in sequence length; attention compute still quadratic.
- Context windows (Sep 2026): Gemini 3.x ~1,048,576 input tokens (Gemini API docs); Claude Opus 5.5, Sonnet 5, Fable 5.1 1M, Haiku 4.5 200k (Anthropic models overview); GPT-6 family ~1.05M (OpenAI models docs); DeepSeek V4 1M (DeepSeek news, Apr 2026). GPT-2 1,024; GPT-3.5 (original ChatGPT) 4,096; Llama 3.1 128k.
- Word equivalents use ~0.75 words per token; KJV Bible ≈ 783,000 words.
