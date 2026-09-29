# Keyword search & BM25: storyboard

1. **The index at the back of the book** (analogy): look up words, jump to pages; the inverted index; BM25 as the default ranking in Lucene, Elasticsearch and OpenSearch.
2. **Search, live** ⭐ (simulation, computed in the browser by `bm25.ts`): type a query over the 15 Kalpanagar help passages; toggles for stop words and a simple stemmer; the query's postings (document × term frequency) with document frequency and IDF; top-5 results with per-term score bars and breakdowns. Examples include exact terms (Aadhaar) and failures ("rubbish", Hindi "कचरा").
3. **The two knobs** (explore): one word's contribution against its count for adjustable k1, b and passage-length ratio, beside plain counting; the sliders also drive the live search. Lucene's formula (no (k1+1)); textbook note.
4. **Finds it or misses it?** (sort, checked against the engine): Aadhaar, "When is rubbish picked up?", a Hindi query, "trade licence late renewal".
5. **What to remember**.
