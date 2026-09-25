# Sources (fact-checked 2026-09-25)

- Frantar et al., GPTQ (arXiv 2210.17323, ICLR 2023): "3 or 4 bits per weight, with negligible accuracy degradation". Lin et al., AWQ (arXiv 2306.00978, MLSys 2024 best paper): "Protecting only 1% salient weights can greatly reduce quantization error". GGUF introduced by llama.cpp on 21 Aug 2023.
- Kurtic et al., "Give Me BF16 or Give Me Death?" (arXiv 2411.02355, ACL 2025): FP8 (W8A8) "effectively lossless", INT8 1–3% degradation, W4A16 "more competitive than expected".
- NVIDIA NVFP4 blog: 16-value blocks with an E4M3 scale; ≤1% accuracy loss vs FP8 on DeepSeek-R1.
- Mixtral 8x7B (Mistral AI, 11 Dec 2023): 46.7B total, 12.9B per token, 2 of 8 experts. DeepSeek-V3 (arXiv 2412.19437): 671B total, 37B active, MLA with 512-dim KV latent and 64-dim rotary key, 61 layers.
- Llama 3.1 (Meta llama-models): 8B 32 layers, 70B 80 layers, 405B 126 layers; 8 KV heads, head dim 128. Qwen2.5-1.5B: 28 layers, 2 KV heads, head dim 128.
- GPU memory and bandwidth: RTX 5090 32 GB, 1,792 GB/s (NVIDIA compare page); H100 80 GB, 3.35 TB/s; H200 141 GB, 4.8 TB/s; MI300X 192 GB, 5.3 TB/s.
- Our measurements (Sep 2026): GPT-2 small in NumPy; all attention and MLP weight matrices quantized with symmetric round-to-nearest (one scale per output column, or per 32 input weights), embeddings unquantized; perplexity on a 325-token passage written for this module; greedy 24-token continuations. Qwen2.5-1.5B-Instruct: onnx-community ONNX files fp16 / quantized (q8) / q4f16 / q4 in Transformers.js, perplexity on the same passage (328 tokens); file sizes from Hugging Face.
- Calculator assumptions: 4-bit ≈ 4.5 bits per weight with scales; 10% runtime overhead; 16-bit KV cache.
