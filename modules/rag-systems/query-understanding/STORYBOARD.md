# Understanding the question: storyboard

1. **The good shopkeeper** (analogy): “same as last time, but bigger” and a double question, worked out before searching the shelves.
2. **Fix the question** ⭐ (fix the problem, real output): five questions (`cases.ts`) over the 32 hybrid-module passages: a vague follow-up with chat history, two questions in one, “house tax” jargon, romanised Hindi, a short abstract question. Search as asked (e5, top 3 and rank of the right passage); pick a technique (standalone rewrite, split, documents' words, translate, HyDE); see Phi-4-mini's real rewrite and the new searches; verdict better / no change / worse (split questions judged by the worse-placed answer). Real results: follow-up 2→1, split 2→1, romanised Hindi 30→1 despite a mistranslation, house tax 2→3 (worse), HyDE 1→1 with an invented “BPL” expansion.
3. **More techniques** (cards): standalone rewrite, multi-query and RAG-Fusion, HyDE, decomposition, step-back, transliteration/translation, routing.
4. **When rewriting hurts** (choice): search with both the original and the rewrite, then fuse.
5. **What to remember**.

Data: `data.json` from `scratchpad/rag/embed/r11.mjs` (multilingual-e5-small; Phi-4-mini q4f16, greedy; HyDE drafts embedded with the "passage: " prefix).
