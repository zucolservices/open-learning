# Serving at scale: storyboard

1. **Share the walk** ⭐ (real data): batching 1→16 requests on a laptop: total 51→254 tokens/s, per user 51→16 tokens/s.
2. **Static or continuous batching** ⭐ (simulation): slot timeline for the first 12 s; batch 1/8/32; quiet/busy/rush-hour traffic; throughput, wait for first token, total time, slot utilisation compared with the other mode.
3. **Memory limits the batch** (compare): 30 KV blocks, three requests reserving the maximum vs paged on demand (vLLM figures 20–38% vs 96%).
4. **Tune it for the job** (sort checkpoint): latency vs throughput jobs.
5. **The serving toolbox** (reference): continuous batching, paged KV, prefix caching, speculative decoding, split prefill/decode, autoscaling; engines vLLM, SGLang, TensorRT-LLM, llama.cpp/Ollama.
6. **What to remember**.
