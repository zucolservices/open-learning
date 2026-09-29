# Capstone: the RAG that answers wrong: storyboard

1. **The car that won't start** (analogy): check fuel, battery, spark in order; "focus on the first upstream failure".
2. **Reading a trace** (explore): the stages (parse, chunk, search, index freshness, prompt, model) and what a trace should record; tools.
3. **Five wrong answers** ⭐ (fix the problem, real output): five real failures from earlier modules, each with a stage-by-stage trace (our descriptions of the real data), a real wrong answer and a real answer after the fix. The learner blames a stage; later stages say "not the first".
   1. Parsing (module 17): OCR lost the bar heights → "W4"; fix: vision model on the page → "W9".
   2. Chunking (module 12): sentence chunks split "BPL allowance" from "20 kilolitres" → "not specified"; fix: small-to-big → 20 kilolitres.
   3. Search (module 22): keyword-only search found nothing for romanised Hindi → "a yojana is a unit of distance"; fix: hybrid → August 2026.
   4. Index freshness (module 5): index built before Circular 22/2026, superseded circular still in → ₹200; fix: sync and delete → ₹500.
   5. Prompt (module 13): right rule at #20 of 20, old rule at #17 → 48 hours; fix: right passage first → 24 hours.
4. **Maps of what goes wrong** (cards): Barnett et al. seven failure points; Leung et al. earliest-stage attribution; practitioner advice.
5. **Where would you look?** (choice): superseded rules reaching the prompt → the index.
6. **What to remember** (track close).

Data: `data.json` assembled from the data files of modules 5, 12, 13, 17 and 22 (no new model runs).
