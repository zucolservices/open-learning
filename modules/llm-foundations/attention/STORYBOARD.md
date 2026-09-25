# Attention: storyboard

1. **Who is “she”?** ⭐ (real attention). Two sentences ("The customer thanked the barista because she made the chai perfectly." and "Asha ordered chai and samosa. Later, Ravi ordered chai and samosa.") × four real GPT-2 small heads: who-is-it-about (L9H0: she → barista 49% vs customer 7%), previous word (L4H11), repeat the pattern / induction head (L7H10: second "ch" → first "ai" 83%), resting spot (L9H11). Click a token for arcs to earlier tokens; full heatmap with the masked upper triangle in a disclosure.
2. **Queries, keys and values** ⭐ (step-through). Toy 2-D vectors for customer / barista / she: q·k scores, ÷√2, softmax weights (16% / 62% / 21%), weighted mix of values.
3. **No peeking** (choice): the causal mask.
4. **How many ways of looking?** (predict): Llama 3.1 70B 80 × 64 = 5,120 heads (GPT-2 small 144).
5. **What to remember**.
