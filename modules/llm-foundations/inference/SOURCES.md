# Sources (fact-checked 2026-09-25)

- NVIDIA, "Mastering LLM Techniques: Inference Optimization": prefill is "a matrix-matrix operation that's highly parallelized"; decode is "a memory-bound operation".
- Databricks, "LLM Inference Performance Engineering: Best Practices": TTFT, time per output token, latency = TTFT + TPOT × tokens; memory bandwidth "is a better predictor of speed of token generation" than peak compute.
- GPU specs (vendor pages): H100 SXM 80 GB, 3.35 TB/s, ~989 TFLOPS BF16 dense / ~1,979 FP8 dense (pages list sparse figures; dense is half); H200 141 GB, 4.8 TB/s, same compute; B200 192 GB (DGX B200: 1,440 GB for 8 GPUs, ~180 GB each usable), 8 TB/s, 4.5 PF FP8 dense per GPU (DGX B200 footnote), ~2.25 PF BF16 dense (inferred from the HGX page).
- Llama 3.1 architecture (Meta llama-models sku_list.py): 8B 32 layers, 8 KV heads, head dim 128; 70B 80 layers, 8 KV heads, head dim 128. KV cache = 2 × layers × KV heads × head dim × 2 bytes per token (128 KiB for 8B, 320 KiB for 70B).
- Timeline model: prefill = 2 × parameters × prompt tokens at 50% of peak; decode = (weights + KV cache) / (70% of peak bandwidth). Efficiency factors are typical assumptions, not measurements; the quadratic attention cost of long prompts is omitted.
- Laptop measurements (ours, Sep 2026): onnx-community/Qwen2.5-1.5B-Instruct q4 with Transformers.js v4 (CPU, ONNX Runtime) on an Apple M3 Pro; TTFT = best of two single-token generations; time per output token = (time for 65 tokens − TTFT) / 64.
- Reading speed: roughly 4–5 words per second for adult silent reading (commonly cited average ~238 wpm, Brysbaert 2019).
