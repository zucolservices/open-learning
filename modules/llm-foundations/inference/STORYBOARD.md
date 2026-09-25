# Inference: storyboard

1. **Two phases** ⭐ (step-through): chef and pantry analogy; prompt tokens light up together in one walk through the weights (prefill); first token (TTFT); one walk per new token (decode); timeline bar.
2. **Measured on a laptop** (real data): Qwen2.5-1.5B q4 on an M3 Pro: TTFT grows from 0.5 s to 14 s as the prompt grows from 73 to 2,053 tokens; time per output token stays ~57–93 ms.
3. **A request, start to finish** ⭐ (simulation): Llama 3.1 8B BF16 / 70B FP8 on H100 / H200 / B200; prompt and answer length; TTFT, tokens per second, total, weights per token; fit warning.
4. **The memory speed limit** (predict): 3,350 GB/s ÷ 16 GB ≈ 210 tokens/s ceiling.
5. **The KV cache** (step-through): recompute-everything vs cache grid; 1,000-token prompt + 500-token answer = 624,750 vs 1,500 token passes; 128 KiB per token.
6. **What does each change speed up?** (sort checkpoint): TTFT vs tokens per second.
7. **What to remember**.
