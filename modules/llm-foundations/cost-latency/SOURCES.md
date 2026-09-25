# Sources (fact-checked 2026-09-25)

- Prices per million tokens, list, Sep 2026 (provider pricing pages):
  - Anthropic (platform.claude.com/docs/en/about-claude/pricing): Fable 5.1 $10/$50, Opus 5.5 $4/$20, Sonnet 5 $2/$10, Haiku 4.5 $1/$5; cache reads 0.1× (0.05× Opus 5.5, 0.025× Fable 5.1); batch 50% off; no long-context surcharge.
  - OpenAI (platform.openai.com/docs/pricing): gpt-6-astra $10/$50 (cached $1), gpt-6-sol $2/$10 (cached $0.20), gpt-6-luna $0.10/$0.50; cached input 0.1× on GPT-5.6 and later; batch and flex 50% off; inputs over 272K billed at 2× input, 1.5× output.
  - Google (ai.google.dev/gemini-api/docs/pricing): Gemini 3.1 Pro Preview $2/$12 (≤200k), Gemini 3.8 Flash $0.75/$3.75 (cached $0.075; rising to $1.50/$7.50 on 1 Jan 2027), Gemini 3.5 Flash-Lite $0.30/$2.50; batch 50% off.
  - DeepSeek (api-docs.deepseek.com/quick_start/pricing): deepseek-v4-pro $1.32/$3.96 (cache hit $0.044), deepseek-flash $0.30/$1.20 (hit $0.006), peak rates; off-peak half price.
  - Gemini 3.1 Pro and gpt-6-luna cached prices in the calculator assume 10% of input.
- GPU rental: AWS p5.48xlarge (8×H100) $55.04/hour on demand (instances.vantage.sh); H100 market ~$1.4–1.7/GPU-hour on marketplaces, ~$2.3–4 at neoclouds, ~$6–12 on hyperscaler on-demand, median ~$3.25 (Thunder Compute / AIMultiple trackers, Sep 2026).
- Jakob Nielsen, "Response Times: The 3 Important Limits" (Nielsen Norman Group; from Usability Engineering, 1993): 0.1 s, 1 s, 10 s.
- Self-hosting throughput (tokens/s per GPU) and utilisation are learner-set assumptions, not measurements.
