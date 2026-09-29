# GraphRAG: storyboard

1. **Two kinds of question** (analogy): the librarian who fetches a book versus "what is this library strong in?"; local vs global.
2. **Plain RAG on a big question** (real output): 28 made-up July 2026 complaint notes; e5 top 5 for "main problems across the city" and Phi-4-mini's answer; coverage of the five themes we wrote in: pipeline works ✗, drains/fever ✓, garbage ~ (only the awareness-drive request), streetlights ✓, portal outage ✗.
3. **Build the map** ⭐ (step-through, real output): Extract (pick a note; Phi-4-mini's raw JSON, with its mistakes: stray dogs as "people", a pipeline as a "document", links to unlisted entities); Connect (85 entities, 86 relationships; names lower-cased and "the" stripped, nothing else merged, so "Portal" and "citizen portal" stay separate); Group & summarise (Louvain, networkx, seed 15; eight communities with 4+ entities get a Phi-4-mini report; one mixes the Nehru School mosquito problem with the portal outage via "corporation"). Layout: each community in its own cell, spring layout inside (display only).
4. **Answer from the map** ⭐ (comparison, real output): map (each report gives up to 3 scored points; 28 points) then reduce; coverage 4 of 5 (streetlights only partly; portal missed), repetitive and cut off. Local question: plain RAG clean, map-reduce muddled. Honest note: the first map prompt was too literal (reports said "doesn't cover the whole city") and its bullet format wasn't parsed; we rewrote it once and re-ran (`embed/r15c.mjs`).
5. **Is it worth it?** (cards): paper results, independent checks and judge bias, cost, tools.
6. **Which tool?** (sort checkpoint): plain RAG vs graph for four questions.
7. **What to remember**.

Data: `scratchpad/rag/r15/notes.json` (written by us), `embed/r15a.mjs` (extraction), graph and communities in Python (networkx 3.7), `embed/r15b.mjs` (community reports), `embed/r15c.mjs` (questions, map, reduce). Phi-4-mini q4f16, greedy; multilingual-e5-small.
