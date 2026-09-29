# Chunking: storyboard

1. **Cutting flashcards** (analogy, step-through): too small (an exception with no rule), too big (a whole chapter), about right (one idea with its heading). Embedding models truncate long input (e5-small: 512 tokens).
2. **The chunk lab** ⭐ (simulation, real data): the made-up Kalpanagar Water Supply Rules 2026 plus the superseded 2019 version in one store. Choose fixed-size / whole sentences / by heading (with document and section titles), size (~150 / 400 / 900 characters) and overlap (0 / 25%). Four questions; top-3 chunks listed first (2019 chunks italic, complete-rule chunks ticked); retrieval verdict (first / top 3 / cut apart / old version first) and Phi-4-mini's real answer from the top 3 with ✓/✗.
3. **Every setting at once**: 13 settings × 4 questions grid of real answer correctness; tap a row to load it. Chroma 2024 and Qu et al. 2025: no universal size; test on your own data.
4. **Search small, return big** (cards): parent–child, structure-aware, semantic and late chunking, with measured caveats.
5. **Which fix?** (sort): rule split from its exception, whole chapters, an orphaned number, identical old-version chunks.
6. **What to remember**: vendor and framework defaults (September 2026).

Data: `data.json` from `scratchpad/rag/embed/r04b.mjs`: chunkers (fixed windows; sentence packing with overlap by whole sentences; section chunks prefixed "title › heading"), Xenova/multilingual-e5-small ("query: "/"passage: "), onnx-community/Phi-4-mini-instruct-ONNX q4f16, greedy, 70 new tokens; correctness by keyword rules in `policy.ts`. System prompt says to answer "I don't know" only if no passage is relevant (a stricter wording made the model refuse even with the right passage).
