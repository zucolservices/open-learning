# Tables & SQL: storyboard

1. **The ledger, not the filing cabinet** (analogy): a clerk finds a leaflet for "what papers do I need?" but counts the ledger for "how many did we approve?".
2. **Search can't count** ⭐ (simulation, real output): 360 made-up application rows as sentences plus 7 help-page passages in one e5 index; top 5 and Phi-4-mini's answer (module 13's rules on). August count and last month: "I don't know"; most pending: wrong (ward 11 with 2; truth ward 2 with 5); average days: close by luck (5.8 vs 5.6); documents: right.
3. **Let the model write SQL** ⭐ (simulation, real output): six questions; Phi-4-mini writes DuckDB SQL from column names only, or from a described schema (values, NULLs, calendar days, today's date, what "approved in a month" means). Results precomputed with DuckDB 1.5 (Python); learners can edit and run any query live with DuckDB-WASM. Bare: 1 of 5 database questions right (others error). Described: 3 right; "last month" errors on SQLite date functions despite being told DuckDB; Ward 9 runs but filters nonsensically (silent wrong); documents question returns a list of rows (not a database question).
4. **Route the question** (sort checkpoint): Search / SQL / Both; feedback gives Phi-4-mini's real routes (four of six to BOTH).
5. **Right query, wrong answer** ⭐ (fix the problem, real output): the rule (15 working days) from search plus our own SQL (12 approved, avg 19.3 calendar days, 4 within 15 days); Phi-4-mini contradicts itself; reveal: 9 of 12 within 15 working days (Mon–Fri, holidays ignored), with a live working-days query. Labelling the result "calendar days" gave almost the same answer.
6. **Keep the SQL on a leash** (cards): read-only views, limits, described views, show the SQL; managed options.
7. **What to remember**.

Data: `data.json` from `scratchpad/rag/r14/gen.py` (seeded rows), `embed/r14.mjs` (retrieval, RAG answers, routes), `embed/r14c.mjs` (DuckDB SQL), `embed/r14b.mjs` (Ward 9 answers); verdicts hand-graded. Phi-4-mini q4f16, greedy.
