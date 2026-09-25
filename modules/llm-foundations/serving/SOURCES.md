# Sources (fact-checked 2026-09-25)

- Yu et al., "Orca: A Distributed Serving System for Transformer-Based Generative Models" (OSDI 2022): iteration-level scheduling (continuous batching).
- Kwon et al., "Efficient Memory Management for Large Language Model Serving with PagedAttention" (arXiv 2309.06180, SOSP 2023): vLLM improves throughput "by 2-4× with the same level of latency"; "only 20.4% - 38.2% of the KV cache memory is used to store the actual token states in the existing systems"; vLLM 96.3% (Fig. 2).
- Leviathan, Kalman and Matias, "Fast Inference from Transformers via Speculative Decoding" (ICML 2023): 2–3× with identical outputs.
- Zheng et al., SGLang (arXiv 2312.07104): RadixAttention prefix caching. NVIDIA Dynamo (GTC, 18 Mar 2025): disaggregated prefill and decode.
- Provider batch APIs at about 50% off (OpenAI, Anthropic, Google; Sep 2026 pricing pages).
- Our measurement: onnx-community/Qwen2.5-0.5B-Instruct q4 with Transformers.js v4 on an Apple M3 Pro; batches of 1–16 prompts (left-padded), 32 new tokens each, greedy.
- The batching simulator is a toy model: Poisson arrivals, 80% of answers 30–200 tokens and 20% 300–800; step time 7 ms + 0.3 ms per active request (7 ms ≈ reading 16 GB of weights at ~70% of an H100's 3.35 TB/s); prefill ignored.
