# Sources (fact-checked 2026-09-25)

- `attention.json`: real attention weights from GPT-2 small (openai-community/gpt2 safetensors from Hugging Face), computed with a minimal NumPy forward pass (LayerNorm, causal self-attention, GELU MLP). The pass was validated against Transformers.js: identical next-token probabilities for "The capital of India is" (" the" 11.3%, " a" 5.8%, " home" 4.2%). Heads were chosen by searching all 144 for each pattern; tokens from the r50k_base encoding. Transformers.js cannot return attention weights for GPT-2 (its ONNX export outputs only logits and KV cache).
- Vaswani et al., "Attention Is All You Need" (2017): softmax(QKᵀ/√d_k)V, multi-head attention; decoder-only models use a causal mask.
- GPT-2 small: 12 layers, 12 heads, 768 dimensions, 124M parameters (Hugging Face config). Llama 3 paper (arXiv 2407.21783), Table 3: 70B has 80 layers and 64 heads (8 KV heads).
- Induction heads: Olsson et al., "In-context Learning and Induction Heads" (Anthropic, 2022). Attention sinks on the first token: Xiao et al., "Efficient Streaming Language Models with Attention Sinks" (2023).
- Q/K/V toy numbers in step 2 are illustrative; the arithmetic is exact.
