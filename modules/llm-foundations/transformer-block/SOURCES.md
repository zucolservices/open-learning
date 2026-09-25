# Sources (fact-checked 2026-09-25)

- `lens.json`: logit lens on GPT-2 small (Hugging Face weights) with the same NumPy forward pass as the attention module (validated against Transformers.js); final LayerNorm and tied unembedding applied to the last position's residual stream after each layer. nostalgebraist, "interpreting GPT: the logit lens" (LessWrong, 2020).
- Parameter counts from configs: GPT-2 small (vocab 50,257, context 1,024, d 768, 12 layers; 124,439,808 parameters). Llama 3 paper (arXiv 2407.21783) Table 3: 8B = 32 layers, 4,096 wide, FFN 14,336, 32 heads, 8 KV heads; 70B = 80 layers, 8,192 wide, FFN 28,672, 64 heads, 8 KV heads; vocab 128,256, untied output layer; SwiGLU feed-forward, RMSNorm pre-norm, RoPE.
- Vaswani et al. 2017 (block structure; residual connections and layer normalisation). The feed-forward share (~2/3 in GPT-style blocks, ~70–80% in Llama 3.1) follows from the configs.
- Feed-forward layers as key-value memories storing knowledge: Geva et al., "Transformer Feed-Forward Layers Are Key-Value Memories" (EMNLP 2021) — hence "thought to live".
