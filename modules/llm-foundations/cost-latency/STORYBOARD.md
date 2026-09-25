# Cost & latency estimation: storyboard

1. **Two meters running**: taxi-meter analogy; one chatbot turn on Claude Sonnet 5 (3,000 in / 250 out = $0.0085); monthly at 300,000 turns a day.
2. **Estimate a monthly bill** (predict): 10,000 chats × 5 turns × (2,000 in, 200 out) at $2/$10 = $9,000.
3. **What will the feature cost?** ⭐ (calculator): three presets; requests, input, output, cached share, batch/off-peak discount; monthly cost for 12 models from four providers.
4. **Cutting the bill** (levers): caching 70% of input → trimming context → routing half to a smaller model.
5. **Will it feel fast?** (explore): TTFT, tokens/s, answer length vs Nielsen's 0.1/1/10 s limits; streaming.
6. **Rent GPUs or pay per token?** (compare): GPU price, throughput, utilisation → $/M tokens vs Gemini 3.8 Flash; break-even chart with a 2-GPU minimum fleet.
7. **The first move** (choice checkpoint): prompt caching first.
8. **What to remember**.
