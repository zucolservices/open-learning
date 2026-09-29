# Metadata, freshness & deletions: storyboard

1. **The notice board** (analogy): a housing society board where old notices stay up; two maintenance charges, neither clearly dated.
2. **Keep the index honest** ⭐ (build & connect, real answers): made-up Kalpanagar circulars (`circulars.ts`): 9/2025 phone bookings (withdrawn), 14/2026 fine ₹200 (superseded), 22/2026 fine ₹500 and portal-only bookings (current). Toggle three pipeline blocks: sync changes → apply deletions → filter status = current. The index view shows status tags, deletions, filtered chunks and which were retrieved; two questions with Phi-4-mini's real answers per state. No sync: stale ₹200 and phone booking; sync only: new circular retrieved but old fine still wins; sync + deletions or filter: correct.
3. **What to store with each chunk** (explore): a clickable metadata record (doc_id, title, dates, status, department, language, content_hash, access).
4. **Which mechanism?** (sort into sync / delete / filter): new circular, withdrawn circular, superseded but kept for history, an erasure request.
5. **What to remember**: pre- vs post-filtering (pgvector's 10%/40 example); DPDP erasure (from May 2027) and embedding inversion.

Data: `data.json` from `scratchpad/rag/embed/r05.mjs` (four index states: none, sync, sync+delete, sync+filter; multilingual-e5-small retrieval over the circulars plus five other help pages; Phi-4-mini q4f16 answers; correctness re-graded with keyword rules).
