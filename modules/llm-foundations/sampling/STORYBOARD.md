# From scores to words: sampling: storyboard

1. **Turn the dials** ⭐ (real model). Five prompts with GPT-2 small's real next-token distributions. Temperature 0–2, top-k (off/1/5/40), top-p (off/0.9/0.5); top-10 bars plus "everything else"; tokens still possible; "Draw 20 times" shows seeded samples and counts (nonsense tail tokens at high temperature).
2. **From scores to probabilities** (step-through). Real logits for tea / coffee / hot / water: ÷ temperature 0.5, exponentiate, normalise.
3. **Is temperature 0 repeatable?** (choice): greedy is not guaranteed identical on shared servers (batch-dependent numerics).
4. **Sampling settings you'll meet**: OpenAI, Anthropic, Gemini, open-weight models (Sep 2026).
5. **What to remember**.
