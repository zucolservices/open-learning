# Model size, memory & quantization: storyboard

1. **Rounding the weights** ⭐ (real weights): 16 GPT-2 weights rounded at 16/8/4/3/2 bits with one scale; error bars; the outlier that sets the scale zeroes everything at 2 bits.
2. **Size it up** (predict): Llama 3.1 70B at 4 bits ≈ 35 GB.
3. **Will it fit?** ⭐ (calculator): six models incl. two MoE, precision, GPU, context, users; stacked weights / KV / overhead against GPU capacity, GPUs needed, decode ceiling.
4. **What do you lose?** ⭐ (real sweep): GPT-2 perplexity by bits, per-column vs group-32 scales; greedy continuations at each level.
5. **Not all 8-bit is equal** (real files): Qwen2.5-1.5B ONNX fp16 3.10 GB / 11.5, q8 1.58 GB / 30.9, q4f16 1.22 GB / 12.1; GPTQ, AWQ, GGUF.
6. **Mixture of experts** (step-through): dense vs router picking 2 of 8 experts; memory for total, reads for active.
7. **One GPU or more?** (sort checkpoint).
8. **What to remember**.
