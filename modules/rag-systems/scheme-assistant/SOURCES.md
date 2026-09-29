# Sources (fact-checked 2026-09-29, before building)

Full notes: scratchpad `rag/m22-facts.md` (reuses m07 and m11 on multilingual retrieval and romanised Hindi).

- myScheme (myscheme.gov.in): NeGD with MeitY and DARPG; launched 4 July 2022; "more than 5056 schemes" (Digital India, 28 Sept 2026); AI chatbot with Hindi and English support.
- Romanised Hindi has no fixed spelling (Roy et al., Dakshina, LREC 2020); keyword search can't match it to Devanagari without transliteration. Elasticsearch/OpenSearch `hindi` analyzer (Lucene HindiAnalyzer: normalisation, stop words, light stemmer) doesn't help romanised queries.
- Models used: multilingual-e5-small (vectors), bge-reranker-v2-m3 (q8), Phi-4-mini-instruct (q4f16, greedy); BM25 as in this track's engine.
- Earlier modules supply each choice: chunking (4), keyword search (6), embeddings (7), hybrid (9), reranking (10), contextual chunks (12), prompt assembly (13), evaluation (18, 19).
- The schemes, pages and questions are made up; retrieval and answers are real, unedited model output; grades are ours.
