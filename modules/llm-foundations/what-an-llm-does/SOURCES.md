# Sources (fact-checked 2026-09-25)

- Vaswani et al., "Attention Is All You Need", arXiv 1706.03762 (12 Jun 2017).
- GPT-1 (OpenAI, Jun 2018, ~117M parameters); GPT-2 (announced 14 Feb 2019, staged release, full 1.5B model 5 Nov 2019); GPT-3: Brown et al., arXiv 2005.14165 (28 May 2020, 175B); ChatGPT launched 30 Nov 2022 (1 million users within days).
- Llama (Meta, Feb 2023) and later open-weight models; reasoning models from 2024.
- Current landscape (Sep 2026): closed frontier models from OpenAI, Anthropic and Google; open-weight DeepSeek V4 (1M context), Qwen3.8, Mistral Large 3. Kept version-free in the lesson because names change monthly.
- Generation: autoregressive decoding, one token at a time from a probability distribution (greedy or sampled). Speculative decoding and multi-token prediction still yield a left-to-right stream; diffusion language models are an exception (not covered here).
- Chat templates: model families use different special-token formats; the markers shown are simplified.
- The "Be the model" step is a real trigram/bigram model trained in the browser on the 25-sentence corpus in `ngram.ts`. Probabilities in the scroll story are illustrative and labelled.
