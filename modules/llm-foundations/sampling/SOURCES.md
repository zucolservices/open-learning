# Sources (fact-checked 2026-09-25)

- `logits.json`: GPT-2 small (Xenova/gpt2 via Transformers.js) final-position logits for five prompts: the top 1,000 tokens exactly, the remaining ~49,000 as a histogram of logits in 0.25 steps (so temperature is computed to within that rounding), plus the full log-sum-exp.
- Top-k: Fan, Lewis & Dauphin, "Hierarchical Neural Story Generation" (2018). Nucleus/top-p: Holtzman et al., "The Curious Case of Neural Text Degeneration" (2019). Min-p: Nguyen et al. (2024, ICLR 2025).
- Non-determinism at temperature 0: Anthropic API docs ("not fully deterministic"); Thinking Machines, "Defeating Nondeterminism in LLM Inference" (Sep 2025): 1,000 runs of Qwen3-235B at temperature 0 gave 80 unique completions, 1 with batch-invariant kernels.
- API settings (Sep 2026): OpenAI temperature 0–2 and top_p; with reasoning effort not "none", temperature/top_p/top_logprobs are rejected. Anthropic: models after Claude Opus 4.6 accept only temperature 1.0, top_p ≥ 0.99, reject top_k. Gemini: temperature 0–2; Google recommends keeping Gemini 3 at the default 1.0 (lower values can loop).
