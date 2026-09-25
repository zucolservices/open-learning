# The transformer block: storyboard

1. **One token's journey** ⭐ (3D step-through, `block-scene.tsx`). Assembly-line analogy. "The Eiffel Tower is in": token IDs → embeddings + position → attention (links from "in" to earlier tokens) → residual add → feed-forward per token → repeated layers (×12 GPT-2, ×80 Llama 3.1 70B) → scores over the vocabulary (Paris, London, Rome, the).
2. **Watch a prediction form** ⭐ (real model). Logit lens on GPT-2 small for three prompts: top-3 predictions after the embedding and each of 12 layers ("tea" from layer 6–7; "Paris" only at layers 11–12; "sam(osa)" at layer 8 right after the layer-7 induction head).
3. **Where the parameters live**: embeddings / attention / feed-forward shares for GPT-2 small, Llama 3.1 8B and 70B, computed from their configs.
4. **Two stations, two jobs** (choice): attention mixes across tokens; feed-forward processes each token.
5. **What to remember**.
