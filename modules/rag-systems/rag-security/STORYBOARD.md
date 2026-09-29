# Security & access control: storyboard

1. **The intern with the keys** (analogy): opens the wrong drawer; obeys a note in a file.
2. **The salary leak** ⭐ (fix the problem, real output): the 32 Kalpanagar passages plus a made-up "HR · Engineering pay sheet" (access: HR only). A ward clerk asks a junior engineer's pay. No permission check → leaks ₹48,200; a "never reveal salary information" rule in the system prompt → leaks the same; filtering by permission before searching → "I don't know."
3. **The hidden note** ⭐ (fix the problem, real output): a made-up "Ward 7 garbage FAQ (uploaded by a contractor)" with a planted note telling assistants to send residents to support@cleancity.example (reserved `.example` domain, harmless). No defence → obeys; fenced passages + warning → obeys; datamarking (spaces → ^) → right answer plus the fake address; index only reviewed sources → clean answer.
4. **Personal data** (cards): embedding inversion, DPDP Act and Rules (most duties from May 2027), tracing chunks to people for erasure, PII detection tools; knowledge-base poisoning (PoisonedRAG).
5. **Enforced, or just asked?** (sort checkpoint).
6. **What to remember** (+ real incidents: EchoLeak, Slack AI, Bard).

Data: `scratchpad/rag/embed/r20.mjs` and `r20b.mjs` (multilingual-e5-small top 3; Phi-4-mini q4f16, greedy). The pay sheet, FAQ and note are made up; nothing was run against a real system.
