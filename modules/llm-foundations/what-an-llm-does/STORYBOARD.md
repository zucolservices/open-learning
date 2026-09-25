# What an LLM actually does: storyboard

1. **From autocomplete to assistant** ⭐ (scroll story). Phone keyboard suggestions → guessing by counting (after "masala" / "the") → more context, better guesses (…of / a cup of / at the tea stall…) → a neural network learns patterns instead of counting → the generation loop (predict, pick, append, repeat). Illustrative probabilities labelled as such.
2. **Be the model** ⭐ (simulation, `ngram.ts`). A real trigram/bigram model trained in the browser on 25 café sentences. Next-word probability bars (click to choose), pick the favourite, roll the dice, write the rest (favourites or dice), look back 1 or 2 words. With 1 word and favourites it loops ("…opens at seven in the cafe opens…"). The full training text is viewable.
3. **Same question, different answer** (choice): sampling.
4. **A chat is just a document** (step-through): chat UI → flattened document with role markers → the model continues after the assistant marker → stops at an end marker → the next message is appended and everything is re-sent.
5. **Where do its answers come from?** (choice): patterns, not a database of facts.
6. **How we got here** (timeline, 2017–2024+).
7. **What to remember**.
