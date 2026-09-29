# Contextual retrieval & small-to-big: storyboard

1. **The torn-out page** (analogy): section 3 of the made-up Kalpanagar Water Supply Rules, 2026; one sentence ("The limit is 20 kilolitres per month, free of charge.") torn out and left asking "Whose limit? Water? 2019 or 2026?".
2. **Give each chunk its context** ⭐ (simulation, real output): 32 one-sentence chunks (25 from the 2026 rules, 7 from the superseded 2019 rules), six "under the current rules" questions. Index each chunk alone, with the title and section heading prefixed, or with a Phi-4-mini note written from Anthropic's prompt. Shows the note, the right chunk's rank for vector (e5), keyword (BM25, this track's engine) and hybrid (RRF, k=60), and the hybrid top 3 with year badges. Honest result: context helps keyword search most (hospital #6 → #1), the free heading does about as well as the notes on these six, one question gets worse with a note, and 2019 chunks still reach the top 3 (a metadata filter's job, module 5).
3. **How it's done, and what it costs** (step-through): Anthropic's prompt verbatim; their failure rates 5.7 → 3.7 → 2.9 → 1.9% (top 20); one call per chunk reading the whole document, prompt caching, the 2024 $1.02 estimate; cheaper cousins (headings, late chunking).
4. **Search small, answer big** ⭐ (simulation, real output): top 3 sentences by vector search versus their parent sections, with Phi-4-mini's answer for each. BPL: sentences alone → "the exact amount … is not specified"; whole sections → 20 kilolitres.
5. **Where to start** (choice): 20,000 circulars on a budget → headings first, measure, then model notes where still failing.
6. **What to remember**.

Data: `data.json` from `scratchpad/rag/embed/r12.mjs` (Phi-4-mini q4f16 notes, greedy, capped at 60 new tokens, so some are cut off; multilingual-e5-small vectors) and `r12b.mjs` (heading-prefixed vectors; small-to-big answers). Ranks precomputed with `modules/rag-systems/bm25/bm25.ts` (stop words + stemming, k1 1.2, b 0.75).
