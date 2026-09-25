# Pretraining & scaling laws: storyboard

1. **Watch a model learn** ⭐ (real training, `tiny-lm.ts`). A 3,352-parameter character-level neural LM (3-char context → embeddings → tanh hidden layer → softmax; Bengio et al. 2003 design) trained live on the café text with mini-batch gradient descent: loss curve from random guessing (3.18) to ~0.4 over 2,500 steps, and the continuation of "the " improving every 100 steps (then memorising and looping).
2. **Spend a compute budget** ⭐ (simulation, `scaling.ts`). Fixed compute C ≈ 6ND at 10²¹ FLOPs, Chinchilla's budget or Llama 3.1 405B's; model-size slider over a loss valley (Besiroglu et al. 2024 re-fit of Chinchilla's data), optimum marker, Gopher 280B vs Chinchilla 70B; parameters, tokens, tokens per parameter, final loss.
3. **How much data for 70B?** (predict): 70B × 20 = 1.4T tokens.
4. **The scale of it**: GPT-3, Chinchilla, Llama 3, DeepSeek-V3, FineWeb; compute and cost notes.
5. **Why train past the sweet spot?** (choice): overtraining small models for cheaper serving.
6. **What to remember**.
