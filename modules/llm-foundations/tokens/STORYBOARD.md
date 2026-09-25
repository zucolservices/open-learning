# Tokens: storyboard

1. **See what the model sees** ⭐ (sandbox). A child reading in chunks analogy. Real OpenAI tokenizers (GPT-2 r50k, GPT-4 cl100k, GPT-4o+ o200k via `gpt-tokenizer`, lazy-loaded per encoding) on typed text or presets (English, Hindi, Kannada, code, numbers, emoji, strawberry). Coloured token chips with IDs on hover; characters that needed several byte tokens grouped and marked ×n; counts and characters per token.
2. **How the pieces are chosen** ⭐ (step-through, `bpe.ts`). Real BPE on the classic low/lower/newest/widest corpus: segmentation, top pair counts, growing vocabulary, 8 merges.
3. **Words to tokens** (predict): 1,000 English words ≈ 1,300 tokens.
4. **The same sentence, a different price** ⭐ Relative token counts for Hindi, Bengali, Tamil, Telugu, Kannada vs English, cl100k vs o200k (FLORES-200).
5. **The strawberry problem** (choice): letters are hidden inside tokens.
6. **Vocabularies you'll meet**: GPT-2, cl100k, o200k, Llama 3, Mistral Tekken, DeepSeek-V3, Qwen3, Gemma 3.
7. **What to remember**.
